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
	point:	require('../common/point.js'),
	shot:	require('./shot.js'),
	util:	require('../common/util.js')
};





/**
 * Fires a bullet
 */
module.exports = function(game, response) {
	if (!response.require(['ship-private-key', 'shoot-dx', 'shoot-dy'])) {
		return;
	}
	var ship_private_key = response.query('ship-private-key');
	var shoot = new wrs.point(
		parseFloat(response.query('shoot-dx')),
		parseFloat(response.query('shoot-dy'))
	);


	/* Check movement type
	 */
	if (!isNaN(shoot.x) || !isNaN(shoot.y)) {
		return cb(403, 'Illegal shot');
	}


	/* Check if client exists
	 */
	if (!game.orbit.exists.private(ship_private_key)) {
		return response.error(403, 'Unknown ship private key');
	}
	var ship = game.orbit.get.private(ship_private_key);


	/* Check if last shot invokation was not long enough away
	 */
	var now = Date.now();
	if (now - ship.last_shoot < game.configuration.getMinShootInterval()) {
		return cb(403, 'Shoot cooldown unfinished (now: '+ now +', last: '+ ship.last_shoot +', '+ (now - ship.last_shoot) +' too fast)');
	}
	ship.last_shoot = now;


	/* Bullet will have a fixed speed
	 */
	shoot = wrs.util.set_length(shoot, game.configuration.getMaxShotSpeed());


	/* Add new bullet to orbit
	 */
	var shot = new wrs.shot(game, ship, shoot);
	game.orbit.add(shot);


	/* Inform client of success
 	 */
	response.json(200, shot.json());
};





