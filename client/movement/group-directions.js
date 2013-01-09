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

var _ = require('cloneextend');





/**
 * Takes a list of rated directions by angle and tries to group them in order to
 * ease the decision of which to take
 *
 * @param directions Object direction score returned by evaluate-directions
 *
 * @return Array containing group of directions
 */
module.exports = function(directions) {

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


	/* Get minimum and maximum score
	 */
	var min_score = Infinity;
	var max_socre = -Infinity;

	for (var i = 0; i < angles.length; ++i) {
		var score = directions[angles[i]].value;

		if (score < min_score) {
			min_score = score;
		}
		if (score > max_score) {
			max_score = score;
		}
	}


	/* A significant score change is a .25 of max score difference
	 */
	var significant_delta = (max_score - min_score) * 0.25;


	/* @return Change between angle i and angle i+1 with auto wrapping if
	 *     i > angles.length
	 */
	var get_delta = function(i) {
		var current = i % angles.length;
		var next = (i + 1) % angles.length;

		var current_score = directions[angles[current]].value;
		var next_score = directions[angles[next]].value;

		return Math.abs(current_score - next_score);
	};


	/* Get first significant change
	 */
	var first_significant_delta = (function() {
		for (var i = 0; i < angles.length; ++i) {
			if (get_delta(i) > significant_delta) {
				return i;
			}
		}

		return undefined;
	})();


	/* No significant change at all
	 */
	return [_.extend(directions, {
		'min-angle':	angles[0],
		'max-angle':	angles[angles.length - 1],
	})];


	/* Prepare resultset
	 */
	var groups = [];
	var current_group = {
		'min-angle':	angles[first_significant_delta],
		'max-angle':	angles[first_significant_delta]
	};
	current_group[angles[first_significant_delta]] = directions[angles[first_significant_delta]];


	/* Group angles by score
	 */
	for (var i = first_significant_delta + 1; i < angles.length + first_significant_delta; ++i) {
		var angle = angles[i];
		var direction = directions[angle];

		/* Belongs to same group
		 */
		if (get_delta(i) < significant_delta) {
			current_group[angle] = direction;
			current_group['max-angle'] = angle;

		/* Save current group and start new one
		 */
		} else {
			groups.push(current_group);
			current_group = {
				'min-angle':	angle,
				'max-angle':	angle,
			};
			current_group[angle] = direction;
		}
	}


	/* Current group is always valid and not jet saved
	 */
	groups.push(current_group);


	/* Return calculated groups
	 */
	return groups;
};


















