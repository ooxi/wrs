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



	/* @return Best approximation of an angle
	 */
	var get_approximation = function(exact_angle) {
		var best_approximation = min_angle;

		for (var angle in best_group['by-angle']) {
			var best_diff = Math.abs(exact_angle - best_approximation);
			var current_diff = Math.min(
				Math.abs(exact_angle - parseFloat(angle)),
				Math.abs(exact_angle - (parseFloat(angle) + 2.0 * Math.PI))
			);

			if (current_diff < best_diff) {
				best_approximation = parseFloat(angle);
			}
		}

		return best_approximation;
	};

	/* Find best approximation for center angle and directiont the player
	 * is flying to
	 */
	var exact_center_angle = (max_angle - min_angle) / 2.0 + min_angle;
	var approx_center_angle = get_approximation(exact_center_angle);

	/* If player is moving and his direction is in the best group, than
	 * consider that angle, too
	 */
	var ship_speed = Math.sqrt(wrs.util.length_sqr(position.dx, position.dy));
//	var exact_ship_angle = Math.acos(position.dx / ship_speed);
	var exact_ship_angle = Math.atan2(position.dy, position.dx);
	if (exact_ship_angle < 0.0) {
		exact_ship_angle += Math.PI;
	}
console.log('ship angle is %j vs %j', exact_ship_angle, Math.acos(position.dx / ship_speed));
	var approx_ship_angle = null;

	if (null !== exact_ship_angle) {
		approx_ship_angle = get_approximation(exact_ship_angle);

		/* Do not use approximation if it's off more than an eight of
		 * a full circle
		 */
		if (Math.abs(exact_ship_angle - approx_ship_angle) > 0.25 * Math.PI) {
			approx_ship_angle = null;
		}
	}



	/* Try to continue movement, if value is only neglegable 
	 */
	var get_value_diff = function(angle_a, angle_b) {
		var value_a = best_group['by-angle'][angle_a].value;
		var value_b = best_group['by-angle'][angle_b].value;

		return Math.abs(value_a - value_b);
	};

	var fly_to_angle = best_group['best-angle'];

	if (get_value_diff(fly_to_angle, approx_center_angle) < 0.001) {
		fly_to_angle = approx_center_angle;
	}
	if (null !== approx_ship_angle) {
		if (get_value_diff(fly_to_angle, approx_ship_angle) < 0.001) {
			fly_to_angle = approx_ship_angle;
		}
	}



	/* If difference between best angle and center angle is neglegable,
	 * choose center angle
	 */
	return best_group['by-angle'][fly_to_angle];
};














