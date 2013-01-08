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
 * Takes a list of rated directions by angle and tries to group them in order to
 * ease the decision of which to take
 *
 * @param directions Object direction score indexed by angle from current
 *     position
 * @param max_delta Max difference between two scores belonging to the same
 *     group
 *
 * @return Array containing group of directions
 */
module.exports = function(directions, max_delta) {

	/* Sort angles (object keys don't have to be sorted by numerical value)
	 */
	var angles = (function() {
		var keys = Object.keys(directions);

		for (var i = 0; i < keys.length; ++i) {
			keys[i] = parseFloat(keys[i]);
		}
		keys.sort();
		return keys;
	})();


	/* No directions so sort? Easy!
	 */
	if (0 === angles.length) {
		return [];
	}


	/* Initialize with first angle
	 */
	var current_angles = [angles[0]];
	var current_score_min = directions[angles[0]];
	var current_score_max = directions[angles[0]];

	var current_group = {
		'min-angle':	angles[0],
		'max-angle':	angles[0]
	};
	current_group[angles[0]] = directions[angles[0]];


	/* Gather all groups
	 */
	var groups = [];

	for (var i = 1; i < angles.length; ++i) {
	}

	
	/* Check if last group can be merged with first group
	 */
	TODO;


};


















