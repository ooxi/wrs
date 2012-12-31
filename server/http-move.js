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
 * Changes the desired client movement
 */
module.exports = function(game, response) {
	if (!response.required(['ship-private-key', 'ship-desired-dx', 'ship-desired-dy'])) {
		return;
	}
	var ship_private_key = response.query('ship-private-key');
	var ship_desired_dx = parseFloat(response.query('ship-desired-dx'));
	var ship_desired_dy = parseFloat(response.query('ship-desired-dy'));

	
	/* Check if client exists
	 */
	if (!game.orbit.exists.private(ship_private_key)) {
		return cb(403, 'Unknown ship private key');
	}
	var ship = game.orbit.get.private(ship_private_key);


	/*
	 */
	var max_speed = configuration['max-ship-speed'];
	if ((query.dx * query.dx + query.dy * query.dy) > (max_speed * max_speed)) {
		return cb(403, 'You are too fast!');
	}
};










