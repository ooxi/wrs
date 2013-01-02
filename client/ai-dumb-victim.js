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
	point:	require('../common/point.js')
};





/**
 * A simple victim doing a random walk
 */
module.exports = function(_api, _configuration, _radar, _ship) {

	/**
	 * AI used to fly the ship to a desired point
	 */
	var _fly_to_ai = new wrs.ai.fly_to(_api, _configuration, _radar, _ship);

	/**
	 * Last time the direction was changed
	 */
	var _last_change = 0;

	/**
	 * Maximum direction change (angle in [0, 180])
	 */
	var _max_angle_change = 45.0;

	/**
	 * Maximum velocity change (relative to current velocity)
	 */
	var _max_velocity_change = 0.25;





	/**
	 * Chooses a random destination, will be used when there is no
	 * information about the ship's current direction
	 */
	var fly_to_random_destination = function() {
		var destination = new wrs.point(
			_configuration['game-zone'] * 2.0 * (Math.random() - 0.5),
			_configuration['game-zone'] * 2.0 * (Math.random() - 0.5)
		);

		console.log('[ai-dumb-victim] I chose %j as random destination', destination);
		_last_change = Date.now();
		_fly_to_ai.fly_to(destination.x, destination.y, fly_random);
	};



	/**
	 * Flies to the next point a view seconds away
	 *
	var fly_random = function() {
		var position = _radar.ship(_ship.public_key());
		if (null === position) {
			
			position = new wrs.point(
				_configuration['game-zone'] * 2.0 * (Math.random() - 0.5),
				_configuration['game-zone'] * 2.0 * (Math.random() - 0.5)
			);
		}
		position.x += _configuration['max-ship-speed'] * 5.0 * (Math.random() - 0.5);
		position.y += _configuration['max-ship-speed'] * 5.0 * (Math.random() - 0.5);

		_fly_to_ai.fly_to(position.x, position.y, function() {
			console.log('[ai-dumb-victim] Reached %j', position);
			fly_random();
		});
	};*/



	/**
	 * Moves the ship
	 */
	this.move = function() {
		_fly_to_ai.move();
	};



	/**
	 * Constructor
	 */
	(function() {
		radar.listen(fly_random);
		fly_random();
	})();
};











