/**
 * Copyright (c) 2013 github/ooxi
 *     https://github.com/ooxi/wrs
 *     violetland@mail.ru
 *
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software in a
 *     product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 * 
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 * 
 *  3. This notice may not be removed or altered from any source distribution.
 */
'use strict';

var async = require('async');
var optimist = require('optimist');

var wrs = {
	ais:	require('./ais.js')
};





/* Initialization has to be done in sequence
 */
async.waterfall([

	/**
	 * Parse arguments
	 */
	function(cb) {
		cb(null, optimist
			.default('server-url', 'http://localhost:31337/')
			.demand('ai').describe('ai', 'Registered AI')
			.argv
		);
	},


	/**
	 * Initialize API and load AI
	 */
	function(argv, cb) {
		var ai = wrs.ais.load(argv['ai']);
		var api = new wrs.api(argv['server-url']);
		cb(null, ai, api);
	},


	/**
	 * Load configuration
	 */
	function(ai, api, cb) {
		api.configuration(function(configuration) {
			cb(null, ai, api, configuration);
		});
	},


	/**
	 * Initialize AI with API and configuration
	 */
	function(ai, api, configuration, cb) {
		cb(null, new ai(api, configuration));
	},


	/**
	 * Register team
	 */
	function(ai, cb) {
		var team_name = wrs.client +'-'+ wrs.version +'-'+ Math.random();
		var team_color = 'white';

		var team = new wrs.team(api, team_name, team_color, function() {
			cb(null, api, configuration, team);
		});
	},


	/**
	 * Spawn ships
	 */
	function(api, configuration, team, cb) {
		var radar = new wrs.radar(api, configuration);

		/* Ships to setup
		 */
		var add_ships = [];

		for (var i = 0; i < configuration['ships-per-team']; ++i) {
			(function(ship_name) {
				add_ships.push(function(cb) {
					var ship = new wrs.ship(api, team, ship_name, function() {
						radar.add(ship.public_key(), ship.private_key());
						cb(null, ship);
					});
				});
			})(wrs.client +'-'+ i);
		}


		/* Setup ships in parallel
		 */
		async.parallel(add_ships, function(err, ships) {
			if (err) throw err;
			cb(null, api, configuration, radar, ships);
		});
	},


	/**
	 * Initialize APIs
	 */
	function(api, configuration, radar, ships, cb) {
		var ai = new wrs.ai.dumb_mob(api, configuration, radar);

		for (var i = 0; i < ships.length; ++i) {
			ai.add(ships[i]);
		}

		setInterval(function() {
			ai.tick();
		}, 250);
	}



/* Inform client of setup success or failure
 */
], function(err) {
	if (err) throw err;
	cosole.log('Heinz client up and running...');
});

