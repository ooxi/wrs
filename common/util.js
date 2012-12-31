﻿/**
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
 * @return Squared distance between a and b
 */
var distance_sqr = function(a, b) {
	return sqr(a.x - b.x) + sqr(a.y - b.y);
};



/**
 * @return Normalized direction from self to target
 */
var look_at = function(self, target) {
	var dx = target.x - self.x;
	var dy = target.y - self.y;
	var len = Math.sqrt(sqr(dx) + sqr(dy));

	return {
		x: dx / len,
		y: dy / len
	};
};



/**
 * @return Random number between min and max. If max is not given, than it is
 *    set to min and min is set to -min
 */
var random = function(min, max) {
	if ('undefined' === typeof(max)) {
		max = min;
		min = -min;
	}

	return Math.random() * (max - min) + min;
};



/**
 * @return Squared value
 */
var sqr = function(value) {
	return value * value;
};





/**
 * Export public symbols
 */
module.exports = {
	distance_sqr:	distance_sqr,
	look_at:	look_at,
	random:		random,
	sqr:		sqr
};

