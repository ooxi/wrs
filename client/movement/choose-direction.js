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
		return group['by-angle'][group['best-angle'];
	};



	/* Choose group with best value
	 */
	var best_group = direction_groups[0];

	for (var i = 0; i < direction_groups.length; ++i) {
		var direction_group = direction_groups[i];
		console.log('group %j has %j', i, best_value(direction_group));

		if (best_value(direction_group) > best_value(best_group)) {
			best_group = direction_group;
		}
	}


	/* Fly to best angle of that group
	 */
	console.log('best-angle: %j, best-value: %j', best_group['best-angle'], best_group['by-angle'][best_group['best-angle']].value);
	return best_group['by-angle'][best_group['best-angle']];

};














