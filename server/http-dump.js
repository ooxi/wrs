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

var wrs = {
	ship:	require('./ship.js'),
	shot:	require('./shot.js')
};





/**
 * Exports internal game state in legacy format
 */
module.exports = function(game, response) {
	var ships = [];
	var shots = [];

	game.orbit.each(function(obj) {

		/* Export shot
		 */
		if (obj instanceof wrs.shot) {
			shots.push({
				public: {
					id:	obj.public_key,
					name:	obj.name,
					x:	obj.x,
					y:	obj.y,
					dx:	obj.dx,
					dy:	obj.dy
				}
			});

		/* Export ship
		 */
		} else if (obj instanceof wrs.ship) {
			ships.push({
				public: {
					id:	obj.public_key,
					x:	obj.x,
					y:	obj.y,
					dx:	obj.dx,
					dy:	obj.dy,
					bc:	obj.__bc
				}
			});

		/* Unknown object type
		 */
		} else {
			response.error(500, 'Unknown object type');
			throw new Error('Object of unknown type cannot be dumped');
		}
	});


	/* Send assembled state
	 */
	response.json(200, {
		clients:	ships,
		shots:		shots
	});
};













