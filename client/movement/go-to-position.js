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
	util:	require('../../common/util.js')
};





/**
 * Tries to reach a position
 */
module.exports = function(_ai, initial_position) {

	/**
	 * Desired destination
	 */
	var _destination = initial_position || null;



	/**
	 * Change desired position
	 */
	this.setDestination = function(destination) {
		_destination = destination;
	};



	/**
	 * A position is preferred, if it's pointing in the right direction
	 */
	this.value = function(ship, src_position, dest_position) {
		if (null === _destination) {
			return 0.0;
		}

		var ship_to_destination = wrs.util.look_at(src_position, _destination);
		var ship_to_target = wrs.util.look_at(src_position, dest_position);

		var destination_angle = 
	};

};












