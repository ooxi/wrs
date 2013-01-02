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

var http = require('http');
var url = require('url');

var wrs = {
	http: {
		configuration:	require('./http-configuration.js'),
		dump:		require('./http-dump.js'),
		gui:		require('./http-gui.js'),
		is_alive:	require('./http-is-alive.js'),
		move:		require('./http-move.js'),
		radar:		require('./http-radar.js'),
		response:	require('./http-response.js'),
		shoot:		require('./http-shoot.js'),
		spawn:		require('./http-spawn.js'),
		team:		require('./http-team.js')
	}
};





/**
 * Manages HTTP interface
 */
module.exports = function(_game) {

	/**
	 * Request dispatch handler
	 */
	var on_request = function(request, response) {

		/* Parse request into internal format
		 */
		var action = url.parse(request.url, true);

		var response = new wrs.http.response(
			action.query,
			response
		);



		/* Do not terminate server on exceptions
		 */
		try {

			/* Frequently used commands have to be checked first
			 */
			if ('/radar' === action.pathname) {
				wrs.http.radar(_game, response);
			} else if ('/move' === action.pathname) {
				wrs.http.move(_game, response);
			} else if ('/shoot' === action.pathname) {
				wrs.http.shoot(_game, response);

			/* Dump must not be called by AIs but is frequently used by
			 * GUIs
			 */
			} else if ('/dump' === action.pathname) {
				wrs.http.dump(_game, response);

			/* Other commands will only occasionally be invoked, order of
			 * check does not matter
			 */
			} else if ('/configuration' === action.pathname) {
				wrs.http.configuration(_game, response);
			} else if ('/is-alive' === action.pathname) {
				wrs.http.is_alive(_game, response);
			} else if ('/spawn' === action.pathname) {
				wrs.http.spawn(_game, response);
			} else if ('/suicide' === action.pathname) {
				response.error(500, 'Suicide implemented');	// XXX
			} else if ('/team' === action.pathname) {
				wrs.http.team(_game, response);

			/* Not a real command, just there for convenience
			 */
			} else if ('/' === action.pathname) {
				wrs.http.gui(_game, response);

			/* Unknown command
			 */
			} else {
				response.error(404, 'Unknown method');
			}

		/* Print exception on console and forward to client
		 */
		} catch (exception) {
			console.log('Unexpected exception while serving http request: '+ exception.stack);
			response.error(500, exception);
		}
	};





	/**
	 * Initialize server
	 */
	http	.createServer(on_request)
		.listen(_game.configuration.getHttpPort())
	;

};













