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
	point:	require('../common/point.js'),
	util:	require('../common/util.js')
};





/**
 * A simple victim doing a random walk
 */
module.exports = function(_api, _configuration, _radar, _ship) {

	/**
	 * Last time the direction was changed
	 */
	var _last_change = 0;



	/**
	 * Minimum time between two changes [ms]
	 */
	var _min_change_interval = 2500;

	/**
	 * Maximum direction change (angle in [0, 180])
	 */
	var _max_angle_change = 45.0;

	/**
	 * Maximum velocity change
	 */
	var _max_velocity_change = 0.25 * _configuration['max-ship-speed'];





	/**
	 * Changes the current direction and velocity of the ship, constrainted
	 * by the configuration seen aboth
	 */
	var change_current_direction = function(ship_radar) {

		/* Extract current direction and velocity
		 */
		var velocity = Math.sqrt(wrs.util.length_sqr(ship_radar.dx, ship_radar.dy));
		var direction = undefined;

		if (velocity > 0.0001) {
			direction = new wrs.point(
				ship_radar.dx / velocity,
				ship_radar.dy / velocity
			);
		} else {
			direction = new wrs.point(1.0, 0.0);
		}


		/* Change velocity
		 */
		var by_velocity = (Math.random() - 0.5) * 2.0 * _max_velocity_change;
		console.log('Changing velocity %j by %j', velocity, by_velocity);
		velocity += by_velocity;

		if (velocity < 0.0) {
			velocity = 0.0;
		} else if (velocity > _configuration['max-ship-speed']) {
			velocity = _configuration['max-ship-speed'];
		}


		/* Change rotation
		 */
		var by_angle = (Math.random() - 0.5) * 2.0 * _max_angle_change;
		if (by_angle <= 0.0) {
			by_angle += 360.0;
		}
		console.log('Changing angle %j by %j', direction, by_angle);
		direction.x = direction.x * Math.cos(by_angle) - direction.y * Math.sin(by_angle);
		direction.y = direction.x * Math.sin(by_angle) + direction.y * Math.cos(by_angle);


		/* Apply changes
		 */
		console.log('Will go from %j to %j:%j', direction, direction.x * velocity, direction.y * velocity);
		_api.move(
			_ship.private_key(),
			direction.x * velocity,
			direction.y * velocity
		);
	};



	/**
	 * Chooses a random destination, will be used when there is no
	 * information about the ship's current direction
	 */
	var fly_in_random_direction = function() {
		var direction = wrs.util.set_length(new wrs.point(
			_configuration['max-ship-speed'] * 2.0 * (Math.random() - 0.5),
			_configuration['max-ship-speed'] * 2.0 * (Math.random() - 0.5)
		), _configuration['max-ship-speed']);

		console.log('[ai-dumb-victim] I chose %j as random direction', direction);
		_api.move(_ship.private_key(), direction.x, direction.y);
	};



	/**
	 * Changes current velocity and rotation if enought time has passed
	 */
	var fly_random = function() {

		/* Don't flood the network with too many requests
		 */
		var now = Date.now();
		if ((now - _last_change) < _min_change_interval) {
			return;
		}
		_last_change = Date.now();
		
		/* Information about current state of ship
		 */
		var ship_radar = _radar.ship(_ship.public_key());

		/* If no state is awailable, we have to fly in a random
		 * direction, otherwise we only do a slight change
		 */
		if (null !== ship_radar) {
			change_current_direction(ship_radar);
		} else {
			fly_in_random_direction();
		}
	};





	/**
	 * Moves the ship
	 */
	this.move = function() {
		fly_random();
	};



	/**
	 * Constructor
	 */
	(function() {
		_radar.listen(fly_random);
		fly_random();
	})();
};











