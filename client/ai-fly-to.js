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
	point:	require('./point.js')
};





/**
 * Flys a ship to a position without trying to avoid anything. Will usually be
 * used by other AIs
 */
module.exports = function(_api, _configuration, _radar, _ship) {

	/* Position which the ship tries to achieve
	 */
	var _desired_position = new wrs.point(0.0, 0.0);
	var _desired_distance = 100.0;
	var _desired_cb = null;



	/**
	 * Sets the desired position
	 */
	this.fly_to = function(x, y, cb) {
		_desired_position.x = x;
		_desired_position.y = y;

		if ('function' === typeof(cb)) {
			_desired_cb = cb;
		} else {
			_desired_cb = null;
		}
	};



	/**
	 * Tries to fly to the desired position without avoiding shots
	 */
	this.move = function() {
		var position = _radar.ship(_ship);
		if (null === self) {
			console.log('[ai-fly-to] I don\'t know myself');
			return;
		}

		var direction = util.look_at(
			self,
			_desired_position
		);

		_api.move(
			_ship.private_key(),
			direction.x * _configuration['max-ship-speed'],
			direction.y * _configuration['max-ship-speed']
		);

		/* If ship is near the desired position, than the callback will
		 * be invoked once
		 */
		if ('function' === typeof(_desired_cb)) {
			if (util.distance_sqr(this.position(), _desired_position) < _desired_distance * _desired_distance) {
				var cb = _desired_cb;
				_desired_cb = null;
				cb();
			}
		}
	};

};









