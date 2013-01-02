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

var uuid = require('../common/uuid.js');

var wrs = {
	collision: {
		shot:	require('./collision-shot.js')
	},
	point:	require('../common/point.js')
};





/**
 * Represents one shot issued by a ship
 */
module.exports = function(_ship, _initial_direction) {

	/**
	 * Time of last actions
	 */
	this.last_radar = 0;
	this.last_shoot = 0
	var _last_move = Date.now();



	/**
	 * Public and private identification
	 */
	this.public_key = uuid.v4();
	this.private_key = uuid.v4();

	/**
	 * Position
	 */
	this.x = _ship.x;
	this.y = _ship.y;

	/**
	 * Current rotation and velocity
	 */
	this.dx = _initial_direction.x;
	this.dy = _initial_direction.x;



	/**
	 * Updates the shot's position
	 */
	this.move = function() {

		/* Time since last movement
		 */
		var now = Date.now();
		var delta = parseFloat(now - _last_move) / 1000.0;
		_last_move = now;


		/* Remember old position
		 */
		var old_x = this.x;
		var old_y = this.y;


		/* Change position
		 */
		this.x = this.x + this.dx * delta;
		this.y = this.y + this.dy * delta;


		/* Remember collision information
		 */
		return new wrs.collision.shot(
			game, this,
			new wrs.point(old_x, old_y),
			new wrs.point(this.x, this.y)
		);
	};

};












