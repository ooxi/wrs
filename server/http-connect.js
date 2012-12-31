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
 * Adds a new ship, if possible
 *
 * @param query.team Team ID
 * @param query.name Ship name, only used as description
 *
 * @return Created ship
 */
module.exports = function(game, response) {
	if (!response.require(['name', 'team'])) {
		return;
	}

	/* Valid team?
	 */
	if (!game.teams.exists(response.query('team'))) {
		return response.error(403, 'Unkown team');
	}
	var team = game.teams.get(response.query('team'));

	/* Create and spawn new ship
	 */
	var ship = new wrs.ship(game, team, response.query('name');

	/* Send ship identification
	 */
	send(200, {
		'public-key':	ship.public_key,
		'private-key':	ship.private_key
	});
};





var connect = function(query, cb) {

	/* Argument validation
	 */
	if (!query.hasOwnProperty('name')) {
		return cb(403, 'Missing name argument');
	}
	for (var secret in clients) {
		if (clients[secret].public.name === query.name) {
			return cb(403, 'Client with that name already exists');
		}
	}

//	/* Needing port to contact with UDP information (ip will be set in the
//	 * server, not by the client)
//	 */
//	if (!query.hasOwnProperty('udp-ip')) {
//		return cb(403, 'Missing udp-ip argument');
//	}
//	if (!query.hasOwnProperty('udp-port')) {
//		return cb(403, 'Missing udp-port argument');
//	}


	/* Add new client
	 */
	var id = uuid.v4();
	var secret = uuid.v4();

	clients[secret] = {
		public: {
			id: id,

			/* Name of ship
			 */
			name: query.name,
			team: 'buttsecks',

			/* Position
			 */
			x: util.random(configuration['spawn-zone']),
			y: util.random(configuration['spawn-zone']),

			/* Current direction and speed
			 */
			dx: 0.0,
			dy: 0.0,

			/* Desired direction and speed
			 */
			_dx: 0.0,
			_dy: 0.0
		},

//		/* UDP information
//		 */
//		'udp-ip': query['udp-ip'],
//		'udp-port': query['udp-port'],

		/* Time of last actions
		 */
		'last-radar': 0,
		'last-shot': 0
	};


	/* Tell client the secret needed for interaction
	 */
	cb(200, {
		id: id,
		secret: secret
	});
};






