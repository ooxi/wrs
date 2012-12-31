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
 * Adds a new ship, if possible
 *
 * @param query.team Team ID
 * @param query.name Ship name, only used as description
 *
 * @return Created ship
 */
module.exports = function(game, response) {
	if (!response.require(['ship-name', 'team-private-key'])) {
		return;
	}
	var ship_name = response.query('ship-name');
	var team_private_key = response.query('team-private-key')


	/* Valid team?
	 */
	if (!game.teams.exists.private(team_private_key)) {
		return response.error(403, 'Unkown private team key');
	}
	var team = game.teams.get.private(team_private_key);


	/* Create and spawn new ship
	 */
	var ship = new wrs.ship(game, team, ship_name);
	game.orbit.add(ship);


	/* Send ship identification
	 */
	response.json(200, {
		'ship-public-key':	ship.public_key,
		'ship-private-key':	ship.private_key
	});
};





