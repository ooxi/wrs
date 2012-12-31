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
module.exports = function(_configuration, _team, _name) {

	/**
	 * Reference to self
	 */
	var _that = this;

	/**
	 * Public and private identification
	 */
	var _public_key = uuid.v4();
	var _private_key = uuid.v4();

	/**
	 * Position
	 */
	this.x = NaN;
	this.y = NaN;

	/**
	 * Rotation and velocity
	 */
	this.dx = NaN;
	this.dy = NaN;





	/**
	 * Constructor
	 */
	(function() {
		var spawner = new wrs.spawner(_configuration);
		spawner.spawn(_that);
	})();
};










