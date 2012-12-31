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
	spawner: require('./spawner.js')
};





/**
 * Every ship can be controlled individually but belongs to a team
 */
module.exports = function(_game, _team, _name) {

	/**
	 * Reference to self
	 */
	var _that = this;

	/**
	 * Time of last actions
	 */
	var _last_radar = 0;
	var _last_shot = 0



	/**
	 * Public and private identification
	 */
	this.public_key = uuid.v4();
	this.private_key = uuid.v4();

	/**
	 * Position
	 */
	this.x = NaN;
	this.y = NaN;

	/**
	 * Current rotation and velocity
	 */
	this.dx = NaN;
	this.dy = NaN;

	/**
	 * Wanted rotation and velocity
	 */
	this._dx = NaN;
	this._dy = NaN;





	/**
	 */
	this.move = function() {

		/* Remember old position
		 */
		var old_x = this.x;
		var old_y = this.y;

		/* Change velocity
		 */
		if (isNaN(this._dx)) {
			this._dx = this.dx;
		}
		if (isNaN(this._dy)) {
			this._dy = this.dy;
		}
	};





	/**
	 * Constructor
	 */
	(function() {
		var spawner = new wrs.spawner(_game);
		spawner.spawn(_that);
	})();
};










