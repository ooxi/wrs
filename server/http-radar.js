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
	ship:	require('./ship.js')
};





/**
 * Sends information about all objects near the client
 */
module.exports = function(game, response) {
	if (!response.require(['ship-private-key'])) {
		return;
	}
	var ship_private_key = response.query('ship-private-key');


	/* Read ship
	 */
	if (!game.orbit.exists.private(ship_private_key)) {
		return response.error(403, 'Unknown ship private key');
	}
	var ship = game.orbit.get.private(ship_private_key);


	/* Check if last radar invokation was not long enough away
	 */
	var now = Date.now();
	if (now - ship.last_radar < game.configuration.getMinRadarInterval()) {
		return cb(403, 'Radar cooldown unfinished (now: '+ now +', last: '+ ship.last_radar +', '+ (now - ship.last_radar) +' too fast)');
	}
	ship.last_radar = now;


	/* Group objects by type
	 */
	var echo = {
		me: ship.json(),
		ships: [],
		shots: []
	};

	game.orbit.each(function(obj) {
		if (obj instanceof wrs.ship) {
			if (obj.public_key !== ship.public_key) {
				echo.ships.push(obj.json());
			}
		} else {
			throw 'Unknown object type';
			response.error(500, 'Unknown object');
	});


	/* Send gathered information
	 */
	response.json(200, echo);
};









