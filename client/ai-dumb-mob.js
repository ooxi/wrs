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
	},
	util:	require('../common/util.js')
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
	 * Fly-To AIs responsible for these ships (indexed by public ship key)
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
		_fly_to[ship.public_key()] = new wrs.ai.fly_to(
			_api, _configuration, _radar, ship
		);
	};

	/**
	 * Remove ship from mob
	 */
	this.remove = function(ship) {
		delete _ships[ship.private_key()];
		delete _fly_to[ship.public_key()];
	};



	/**
	 * Select the vicitm, which is closest to the center of our ships
	 */
	var choose_victim = function() {

		/* Get center
		 */
		var center = new wrs.point(0.0, 0.0);
		var ships = 0;

		for (var private_key in _ships) {
			var ship_radar = radar.ship(private_key);

			if (null !== ship_radar) {
				center.x += ship_radar.x;
				center.y += ship_radar.y;
				++ships;
			}
		}

		/* We have no ships (or at least no information about the
		 * position of our ships) so we cannot make an informed choise
		 */
		if (0 === ships) {
			return;
		}
		center.x /= ships;
		center.y /= ships;


		/* Find the victim closest to the center
		 */
		var victims = _radar.ships();
		var min_distance_sqr = Infinity;
		var victim = undefined;

		for (var public_key in victims) {
			
			/* If we own that ship, don't treat it as enemy
			 */
			if (_fly_to.hasOwnProperty(public_key)) {
				continue;
			}

			var distance_sqr = wrs.util.distance_sqr(center, victims[public_key]);

			if (distance_sqr < min_distance_sqr) {
				min_distance_sqr = distance_sqr;
				victim = victims[public_key];
			}
		}


		/* Select chosen victim
		 */
		if ('undefined' !== typeof(victim)) {
			_victim = victim;
		}
	};



	/**
	 * All ships try to get closer to the victim
	 */
	var move = function() {

		/* If no victim is chosen, we cannot do anything
		 */
		if (null === _victim) {
			return;
		}
		var victim_radar = _radar.ship(_victim['public-key']);

		/* Fly all ships to that victim
		 */
		for (var public_key in _fly_to) {
			_fly_to[public_key].fly_to(victim_radar.x, victim_radar.y);
		}
	};



	/**
	 * Shoot at the victim :-)
	 */
	var shoot = function() {

		/* No victim to shoot at
		 */
		if (null === _victim) {
			return;
		}
		var victim_radar = _radar.ship(_victim['public-key']);

		/* Shoot at the current position
		 */
		for (var private_key in _ships) {
			var direction = wrs.util.look_at(
				_ships[private_key], victim_radar
			);
			_api.shoot(private_key, direction.x, direction.y);
		}
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
			var ship = _ships[private_key];
			_fly_to[ship.public_key()].move();
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













