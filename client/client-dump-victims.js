/**
 * Copyright (c) 2012 github/ooxi
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
	api:		require('./api.js'),
	team:		require('./team.js'),

	client:		'dump-victim',
	version:	'0.1-beta'
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
			.argv
		);
	},


	/**
	 * Initialize API
	 */
	function(argv, cb) {
		cb(null, new wrs.api(argv['server-url']));
	},


	/**
	 * Load configuration
	 */
	function(api, cb) {
		api.configuration(function(configuration) {
			cb(null, api, configuration);
		});
	},


	/**
	 * Register team
	 */
	function(api, configuration, cb) {
		var team_name = wrs.client +'-'+ wrs.version +'-'+ Math.random();
		var team_color = 'red';

		var team = new wrs.team(team_name, team_color, function() {
			cb(null, api, configuration, team);
		});
	},


	/**
	 * Spawn ships
	 */
	function(api, configuration, team, cb) {

		/* Ships to setup
		 */
		var add_ships = [];

		for (var i = 0; i < configuration['ships-per-team']; ++i) {
			(function(ship_name) {
				add_ships.push(function(cb) {
					api.spawn(ship_name, team.private_key(), function(ship) {
						cb(null, ship);
					});
				});
			})(wrs.client +'-'+ i);
		}


		/* Setup ships in parallel
		 */
		async.parallel(add_ships, function(err, ships) {
			if (err) throw err;
			console.log('%j', ships);
		});
	}



/* Inform client of setup success or failure
 */
], function(err) {
	if (err) throw err;
	cosole.log('Dump victims client up and running...');
});






