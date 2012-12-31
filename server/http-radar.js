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
 */
module.exports = function(response) {

	/* Check query
	 */
	if (!response.require(['secret'])) {
		return;
	}
	if (!query.hasOwnProperty('secret')) {
		return cb(403, 'Missing secret argument');
	}

	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, 'Unknown client');
	}
	var client = clients[query.secret];
	var nearby_clients = {};
	var nearby_shots = {};


	/* Check if last radar invokation was not long enough away
	 */
	var now = Date.now();
	if (now - client['last-radar'] < configuration['min-radar-interval']) {
		return cb(403, 'Radar cooldown unfinished (now: '+ now +', last: '+ client['last-radar'] +', '+ (now - client['last-radar']) +' too fast)');
	}
	client['last-radar'] = now;


	/* Aggregate client and shot information
	 */
	for (var secret in clients) {
		if (secret !== query.secret) {
			nearby_clients[clients[secret].public.id] = clients[secret].public;
		}
	}
	for (var uuid in shots) {
		nearby_shots[shots[uuid].public.id] = shots[uuid].public;
	}

	cb(200, {
		'me': client.public,
		'nearby-clients': nearby_clients,
		'nearby-shots': nearby_shots
	});
};
