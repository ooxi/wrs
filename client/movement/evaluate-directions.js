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





/**
 * Evaluates a couple of directions around a given ship position
 *
 * @param movement Position evaluation function to use
 * @param ship Ship to test
 * @param ship_position Position of that ship, must not be null
 * @param steps Amount of directions to try
 * @param distance Distance from ship to evaluate
 *
 * @return Array containing objects describing the tested positions
 *     .angle Angle from the current position
 *     .dx Direction dx (normalized)
 *     .dy Direction dy (normalized)
 *     .value Position's value
 */
module.exports = function(movement, ship, ship_position, steps, distance) {

	/* Try each step
	 */
	var result = [];
	var step = 2 * Math.PI / steps;

	for (var i = 0; i < steps; ++i) {
		var angle = step * i;
		var x_diff = Math.cos(angle) * distance;
		var y_diff = Math.sin(angle) * distance;

		var try_position = new wrs.point(
			position.x + x_diff,
			position.y + y_diff
		);
		var value = this.movement.value(ship, try_position);

		this.gui.arrow(try_position, new wrs.point(
			Math.cos(angle) * (5.0 - value) * 10.0,
			Math.sin(angle) * (5.0 - value) * 10.0
		), 0.5, 'blue');
	}
};





















