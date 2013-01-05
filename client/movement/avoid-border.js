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
 * Avoids getting destroyed by hitting the border
 */
module.exports = function(_ai) {

	/**
	 * As soon as the client is this close to the border a warning will be
	 * issued
	 */
	var _soft_warning = undefined;

	/**
	 * As soon as the client is this close to the border, the client will
	 * be stopped going any further
	 */
	var _hard_warning = undefined;





	/**
	 * Issues a warning (relative to proximity of ship to border) if ship
	 * is near a border or a halt if ship is too close
 	 */
	this.value = function(ship, src_position, dest_position) {

		/* Distance of position to all four enclosing borders
		 */
		var distance = function(position) {
			return {
				top:	+_ai.configuration['game-zone'] - position.y,
				bottom:	-_ai.configuration['game-zone'] + position.y,
				left:	+_ai.configuration['game-zone'] - position.x,
				right:	-_ai.configuration['game-zone'] + position.x
			}
		};
		var src_distance = distance(src_position);
		var dest_distance = distance(dest_position);


		/* Value describing action for one border
		 */
		var value = function(border) {
			var dist = dest_distance[border];

			if (dist > _soft_warning) {
				return 0.0;
			}
			if (dist < _hard_warning) {
				return +1.0;
			}

			/* Soft warning is relative to distance
			 */
			var span = _soft_warning - _hard_warning;
			var at = dist - _hard_warning;

			return (at / span) * 0.5;
		};


		return value('top') + value('bottom') + value('left') + value('right');


//		/* Value describing action for one border
//		 */
//		var value = function(border) {
//			var src_border_distance = src_distance[border];
//			var dest_border_distance = src_distance[border];
//
//			/* Calculus is done with minimum distance. If the
//			 * destination is farer away than the source, than
//			 * we want to go there, even if is's still in th danger
//			 * zone
//			 */
//			var min_distance = Math.min(
//				src_border_distance,
//				dest_border_distance
//			);
//			var prefix = src_border_distance > dest_border_distance
//				? +1 : -1
//			;
//		};

	};





	/**
	 * Constructor
	 */
	(function() {
		_soft_warning = Math.max(
			_ai.configuration['game-zone'] / 10.0,
			_ai.configuration['max-ship-speed'] * 3.0 + _ai.configuration['ship-radius']
		);

		_hard_warning = _ai.configuration['max-ship-speed'] + _ai.configuration['ship-radius'];
	})();
};








