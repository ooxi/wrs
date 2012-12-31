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

var http = require('http');





/**
 * Manages HTTP interface
 */
module.exports = function(configuration) {

	/**
	 * Sends a JSON message
	 */
	var send = function(status, obj) {
		response.writeHead(status, {'Content-Type': 'application/json'});

		if ((200 !== status) && ('string' === typeof(obj))) {
			obj = {
				error: true,
				message: obj
			};
		}
		response.end(JSON.stringify(obj));
	};





	/**
	 * Initialize server
	 */
	http.createServer(function(request, response) {
		var action = url.parse(request.url, true);

		/* Frequently used commands have to be checked first
		 */
		if ('/radar' === action.pathname) {
			radar(action.query, send);
		} else if ('/move' === action.pathname) {
			move(action.query, send);
		} else if ('/shoot' === action.pathname) {
			shoot(action.query, send);

		/* Dump must not be called by AIs
		 */
		} else if ('/dump' === action.pathname) {
			dump(action.query, send);

		/* Other commands will only occasionally be invoked, order of
		 * check does not matter
		 */
		} else if ('/configuration' === action.pathname) {
			send(200, configuration);
		} else if ('/connect' === action.pathname) {
			action.query['udp-ip'] = request.connection.remoteAddress;
			connect(action.query, send);
		} else if ('/is-alive' === action.pathname) {
			is_alive(action.query, send);
		} else if ('/suicide' === action.pathname) {
			suicide(action.query, send);

		/* Not a real command, just there for convenience
		 */
		} else if ('/' === action.pathname) {
			gui(response);

		/* Unknown command
		 */
		} else {
			send(404, 'Unknown method');
		}
	}).listen(configuration.getHttpPort());


};













