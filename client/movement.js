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

var wrs = {
	movement: {
		avoid_border:	require('./movement-avoid-border.js')
	}
};





/**
 * Used to determine the best movement for a ship
 */
module.exports = function(_ai) {

	/**
	 * @return Number describing the advantage of flying to that position
	 *     in a linear movement from the ship's current position
	 */
	this.value = function(ship, position) {

		/* Even without the ship's position some (static) value based
		 * movement evaluation can be done
		 */
		var ship_position = _ai.radar.ship(ship.public_key());
	};

};





