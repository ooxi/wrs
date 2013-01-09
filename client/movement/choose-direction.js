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





/**
 * Chooses a direction from a group of directions
 *
 * @param ship The ship to move
 * @param position The ship's current position and movement
 * @param direction_groups Direction groups to choose from
 */
module.exports = function(ship, position, direction_groups) {

	/* @return Best value of group
	 */
	var best_value = function(group) {
		return group['by-angle'][group['best-angle']].value;
	};



	/* Choose group with best value
	 */
	var best_group = direction_groups[0];

	for (var i = 1; i < direction_groups.length; ++i) {
		var direction_group = direction_groups[i];

		if (best_value(direction_group) > best_value(best_group)) {
			best_group = direction_group;
		}
	}



	/* Get the half angle of the best group (the angle in between the min-
	 * and max angle)
	 */
	var min_angle = best_group['min-angle'];
	var max_angle = best_group['max-angle'];

	/* Happens if one group wrapps around angle 0
	 */
	if (min_angle > max_angle) {
		max_angle += 2.0 * Math.PI;
	}

	/* Find best approximation for center angle
	 */
	var exact_center_angle = (max_angle - min_angle) / 2.0 + min_angle;
	var best_center_angle = min_angle;

	for (var angle in best_group['by-angle']) {
		var best_diff = Math.abs(exact_center_angle - best_center_angle);
		var current_diff = Math.min(
			Math.abs(exact_center_angle - parseFloat(angle)),
			Math.abs(exact_center_angle - (parseFloat(angle) + 2.0 * Math.PI))
		);

		if (current_diff < best_diff) {
			best_center_angle = parseFloat(angle);
		}
	}



	/* If difference between best angle and center angle is neglegable,
	 * choose center angle
	 */
	var fly_to_angle = best_group['best-angle'];
	var best_angle_value = best_group['by-angle'][fly_to_angle].value;
	var center_angle_value = best_group['by-angle'][best_center_angle].value;

	if ((best_angle_value - center_angle_value) < 0.001) {
		fly_to_angle = best_center_angle;
	}


	/* Fly to chosten angle
	 */
	return best_group['by-angle'][fly_to_angle];
};














