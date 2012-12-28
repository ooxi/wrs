/**
 * Copyright (c) 2012 ooxi
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

var clients = [];





var send = function(code, obj, response) {
	response.writeHead(code, {
		'Content-Type': 'application/json'
	});
	response.end(JSON.stringify(obj));
};



var connect = function(action, response) {
	if (!action.query.hasOwnProperty('name')) {
		return send(403, {
			error: true,
			message: 'Missing name'
		}, response);
	}

	if (clients.hasOwnProperty(action.query.name)) {
		return send(403, {
			error: true,
			message: 'Duplicated client name'
		}, response);
	}

	clients[action.query.name] = {
		x: (Math.random() - 0.5) * 1000.0,
		y: (Math.random() - 0.5) * 1000.0
	};

	send(200, clients[action.query.name], response);
};



var move = function(action, response) {
};





http.createServer(function (req, res) {
	var action = url.parse(req.url, true);

	if ('/connect' === action.pathname) {
		connect(action, res);
	} else if ('/move' === action) {
		move(action, res);
	} else {
		send(404, {
			error: true,
			message: 'Invalid method'
		}, res);
	}

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');






