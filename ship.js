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
var api = require('./api.js');
var configuration = require('./configuration.js');
var radar = require('./radar.js');
var util = require('./util.js');





/**
 * Manages a single ship with primitive tasks
 */
module.exports = function(name) {

	/* Public and private key
	 */
	var _public_key = undefined;
	var _private_key = undefined;

	/* Position which the ship tries to achieve
	 */
	var _desired_position = {
		x: 0.0,
		y: 0.0
	};

	/* Is this ship still alive?
	 */
	var _is_alive = true;





	/**
	 * @return Position of this ship
	 */
	this.position = function() {
		return radar.client(_public_key);
	};

	/**
	 * @return true iff ship still is alive
	 */
	this.is_alive = function() {
		return _is_alive;
	};

	/**
	 * Sets the desired position
	 */
	this.fly_to = function(x, y) {
		_desired_position.x = x;
		_desired_position.y = y;
	};

	/**
	 * Tries to fly to the desired position while avoiding shots
	 */
	this.move = function() {
		var direction = util.look_at(
			this.position(),
			_desired_position
		);

		api.move(
			_private_key,
			direction.x * (configuration['max-ship-speed'] - 0.0001),
			direction.y * (configuration['max-ship-speed'] - 0.0001)
		);
	};





	/**
	 * Initialize client
	 */
	(function() {
		api.connect(name, function(response) {
			_public_key = response.id;
			_private_key = response.secret;
			radar.add(_private_key);
		});
	})();
};












