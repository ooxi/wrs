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

var wrs = {
	ai: {
		fly_to:	require('./ai-fly-to.js')
	}
};





/**
 * A dumb mob trying to kill one of the nearest enemy ships
 */
module.exports = function(_api, _configuration, _radar) {

	/**
	 * Self reference
	 */
	var _that = this;



	/**
	 * All ships belonging to this mob (indexed by private key)
	 */
	var _ships = {};

	/**
	 * Fly-To AIs responsible for these ships (indexed by private ship key)
	 */
	var _fly_to = {};

	/**
	 * Chosen target
	 */
	var _victim = null;



	/**
	 * Time of last change in direction and velocity
	 */
	var _last_move = 0;

	/**
	 * Time of last shot
	 */
	var _last_shoot = 0;



	/**
	 * Minimum interval between movements [ms]
	 */
	var _min_move_interval = _configuration['min-radar-interval'];

	/**
	 * Minimum interval between shots [ms]
	 */
	var _min_shoot_interval = _configuration['min-shoot-interval'];	





	/**
	 * Add ship to mob
	 */
	this.add = function(ship) {
		_ships[ship.private_key()] = ship;
		_fly_to[ship.private_key()] = new wrs.ai.fly_to(
			_api, _configuration, _radar, ship
		);
	};

	/**
	 * Remove ship from mob
	 */
	this.remove = function(ship) {
		delete _ships[ship.private_key()];
		delete _fly_to[ship.private_key()];
	};



	/**
	 * All ships
	 */
	var move = function() {

		/* If no victim is chosen, we cannot do anything
		 */
	};



	/**
	 * Main method
	 */
	this.tick = function() {

		/* If no target is chosen, choose the nearest
		 */
		if (null === _victim) {
			choose_victim();
		}


		/* Do not act, if not enough time since the last action has
		 * passed
		 */
		var now = Date.now();

		if ((now - _last_move) > _min_move_interval) {
			_last_move = now;
			move();
		}

		if ((now - _last_shoot) > _min_shoot_interval) {
			_last_shoot = now;
			shoot();
		}


		/* Execute ship fly-to AI
		 */
		for (var private_key in _fly_to) {
			_fly_to[private_key].move();
		}
	};





	/**
	 * Constructor
	 */
	(function() {
		_radar.listen(function() {
			_that.tick()
		});
		_that.tick();
	})();
};













