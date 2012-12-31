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
 * Server API
 */
module.exports = function(_server_url) {

	/* Shortcut for better readability
	 */
	var e = encodeURIComponent;





/**
 * Registers a new ship
 */
var do_connect = function(name, success_cb, exception_cb) {
	http.get(server_url +'connect?name='+ e(name) +'&udp-port='+ e(333), read_object(
		success_cb, exception_cb
	));
};



/**
 * Updates ship and shot information
 */
var do_is_alive = function(public_id, success_cb, exception_cb) {
	http.get(server_url +'is-alive?id='+ e(public_id), read_object(function(response) {
		success_cb(response['is-alive']);
	}, exception_cb));
};



/**
 * Change speed and direction of client
 */
var do_move = function(secret, dx, dy, success_cb, exception_cb) {
	if ('function' !== typeof(success_cb)) {
		success_cb = function() {};
	}

	http.get(server_url +'move?secret='+ e(secret) +'&dx='+ e(dx) +'&dy='+ e(dy), read_object(
		success_cb, exception_cb
	));
};



/**
 * Updates ship and shot information
 */
var do_radar = function(secret, success_cb, exception_cb) {
	http.get(server_url +'radar?secret='+ e(secret), read_object(
		success_cb, exception_cb
	));
};



/**
 * Shoots
 */
var do_shoot = function(secret, dx, dy, success_cb, exception_cb) {
	if ('function' !== typeof(success_cb)) {
		success_cb = function() {};
	}
	if ('function' !== typeof(exception_cb)) {
		exception_cb = function() {};
	}

	http.get(server_url +'shoot?secret='+ e(secret) +'&dx='+ e(dx) +'&dy='+ e(dy), read_object(
		success_cb, exception_cb
	));
};


};



var server_url = 'http://localhost:31337/';





/**
 * Parses a JSON object from a http response
 */
var read_object = function(cb) {

	/* Exception callback can be overwritten
	 */
	var exception_cb = function(exception) {
		throw exception;
	};
	if ('function' === typeof(arguments[1])) {
		exception_cb = arguments[1];
	}


	return function(response) {
		var message = [];

		response.on("data", function(chunk) {
			message += chunk
		});
		response.on("end", function() {
			var obj = JSON.parse(message);

			if (200 != response.statusCode) {
				exception_cb('Received unexpected exception: '+ obj.message);
			} else {
				cb(obj);
			}
		});
	};
};










/**
 * Export public api
 */
module.exports = {
	connect: do_connect,
	is_alive: do_is_alive,
	move: do_move,
	radar: do_radar,
	shoot: do_shoot
};

