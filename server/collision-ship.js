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
 * A ship's collision space is determined by 
 */
module.exports = function(_ship, _old, _new) {

	/**
	 * Only handles ships
	 */
	this.type = function() {
		return 'ship';
	};



	/**
	 * Bouncing box around the ship movement
	 */
	this.bouncing_circle = function() {
		var dx = _new.x - _old.x;
		var dy = _new.y - _old.y;

		return {
			x:	(_new.x + _old.x) / 2.0,
			y:	(_new.y + _old.y) / 2.0,
			radius:	Math.sqrt(dx * dx + dy * dy) / 2.0
		};
	};



	/**
	 * Only collisions with other ships will be detected
	 */
	this.collide = function(other) {

		/* Currently only collisions with other ships are computed,
		 * collisions with shots are handled in wrs.collision.shot
		 */
		if ('ship' === other.type()) {
			return collide_ship(other);
		}
	};



	/**
	 * Computes
	 */
};












