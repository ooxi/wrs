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
	util:	require('../common/util.js')
};





/**
 * Changes the desired client movement
 */
module.exports = function(game, response) {
	if (!response.require(['ship-private-key', 'ship-desired-dx', 'ship-desired-dy'])) {
		return;
	}
	var ship_private_key = response.query('ship-private-key');
	var ship_desired_dx = parseFloat(response.query('ship-desired-dx'));
	var ship_desired_dy = parseFloat(response.query('ship-desired-dy'));

	
	/* Check if client exists
	 */
	if (!game.orbit.exists.private(ship_private_key)) {
		return response.error(403, 'Unknown ship private key');
	}
	var ship = game.orbit.get.private(ship_private_key);


	/* Client must not fly too fast
	 */
	var max_speed = game.configuration.getMaxShipSpeed();
	if (wrs.util.length_sqr(ship_desired_dx, ship_desired_dy) > wrs.util.sqr(max_speed + 0.0001)) {
		return response.error(403, 'You are too fast '+ Math.sqrt(wrs.util.length_sqr(ship_desired_dx, ship_desired_dy)) +' > '+ Math.sqrt(wrs.util.sqr(max_speed + 0.0001)));
	}


	/* Set desired movement
	 */
	ship.desired_dx = ship_desired_dx;
	ship.desired_dy = ship_desired_dy;


	/* Everything went well
	 */
	response.json(200, {});
};










