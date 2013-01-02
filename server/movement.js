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
 * Manages object movement and collisions
 */
module.exports = function(game) {

	/**
	 * First moves all objects, than checks collisions between those objects
	 */
	this.move = function() {
		var collisions = [];

		/* Move objects
		 */
		game.orbit.each(function(obj) {
			var collision = obj.move();
			obj.__bc = collision.bounding_circle();
			collisions.push(collision);
		});

		/* Check for collisions
		 *
		 * @warning Simplification to var j = i + 1 is _not_ possible,
		 *     because ships do not collide with bulltest but bulltest
		 *     will collide with ships
		 */
		for (var i = 0; i < collisions.length; ++i) {
			for (var j = 0; j < collisions.length; ++j) {
				if (i != j) {
					collisions[i].collide(collisions[j]);
				}
			}
		}
	};

};











