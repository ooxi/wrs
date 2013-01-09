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

var Class = require('uberclass');

var wrs = {
	gui:		require('./gui.js'),
	movement:	require('./movement.js'),
	point:		require('../common/point.js'),
	radar:		require('./radar.js'),
	util:		require('../common/util.js')
};





/**
 * Common AI stuff
 */
module.exports = Class.extend({

	/**
	 * Constructor
	 *
	 * @param _configuration Loaded game configuration
	 * @param _api Initialized API
	 */
	init: function(_api, _configuration, _team) {

		/**
		 * Independent modules
		 */
		this.api = _api;
		this.configuration = _configuration;
		this.team = _team;

		/**
		 * Dependent modules
		 */
		this.gui = new wrs.gui(this, 1337);
		this.movement = new wrs.movement(this);
		this.radar = new wrs.radar(this.api, this.configuration);

		/**
		 * Registered ships
		 */
		this.ships = {};
	},





	/**
	 * AI name (will be used as team name)
	 */
	getAiName: function() {
		console.log('[ai] AI implementation has to overwrite getAiName');
		return 'unknown-ai';
	},

	/**
	 * AI version
	 */
	getAiVersion: function() {
		console.log('[ai] AI implementation has to overwrite getAiVersion');
		return '0.1';
	},





	/**
	 * Add ship to AI
	 */
	addShip: function(ship) {
		this.ships[ship.private_key()] = ship;
		this.radar.add(ship.public_key(), ship.private_key());
	},

	/**
	 * Remove ship from AI
	 */
	removeShip: function(ship) {
		delete this.ships[ship.private_key()];
	},





	/**
	 * Has to be invoked periodically
	 *
	 * Base implementation will only move ships according to value matrix
	 */
	tick: function() {

		/* Iterate through all ships an invoke movement predication if
		 * position is available
		 */
		for (var private_key in this.ships) {
			var ship = this.ships[private_key];
			var position = this.radar.ship(ship.public_key());

			if (null === position) {
				console.log('Position of ship '+ ship.public_key +' unknown');
				continue;
			}
			
			this.gui.circle(position, this.configuration['ship-radius'], 'lime', 'black');
			this['protected-move-ship'](ship, position);
		}
	},



	/**
	 * Will be called to change ship movement
	 */
	'protected-move-ship': function(ship, position) {

		/* Different positions to try, distributed even around current
		 * ship position
		 */
		var steps = 30;

		/* Distance from ship to try
		 */
		var distance = this.configuration['ship-radius'] * 2.0;


		/* Evaluate a couple of directions around current position
		 */
		var directions = this.movement.evaluate_directions(
			
		);


		/* Could not find any position o_O
		 */
		if (null == best_position) {
			console.log('[ai] Cannot move '+ ship.public_key() +' because no position could be determined');
			return;
		}


		/* Move ship in best direction
		 */
		var direction = wrs.util.look_at(position, best_position);
		var movement = wrs.util.set_length(direction, this.configuration['max-ship-speed']);

		this.gui.arrow(position, movement, 1.0, 'black');
		this.api.move(ship.private_key(), movement.x, movement.y);
	},

});









