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
	movement:	require('./movement.js'),
	radar:		require('./radar.js')
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
	init: function(_configuration, _api, _team) {

		/**
		 * Independent modules
		 */
		this.configuration = _configuration;
		this.api = _api;
		this.team = _team;

		/**
		 * Dependent modules
		 */
		this.movement = new wrs.movement(this);
		this.radar = new wrs.radar(this.configuration, this.api);

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
	 * Base implementation will move all ships according to 
	 */
	tick: function() {
		console.log('[ai] AI implementation has to overwrite tick');
	}

});









