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

var dgram = require('dgram');
var http = require('http');
var url = require('url');
var uuid = require('../common/uuid.js');
var util = require('./util.js');

var configuration = require('./configuration.js');
var clients = {};
var shots = {};





/**
 * Used to propagate an object to all clients
 */
var broadcast = function(type, obj) {
	return;

	for (var secret in clients) {
		var client = clients[secret];

		var msg = new Buffer(JSON.stringify({
			type: type,
			secret: secret,
			payload: obj
		}));


		var broadcast_socket = dgram.createSocket('udp4');
		console.log('%j '+ msg.length, client);
		broadcast_socket.send(
			msg, 0, msg.length,
			client['udp-port'], client['udp-ip']
		);
	}
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



var radar = function(query, cb) {
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



var move = function(query, cb) {
	if (!query.hasOwnProperty('secret')) {
		return cb(403, 'Missing secret argument');
	}

	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, 'Unknown client');
	}
	var client = clients[query.secret];


	if (!query.hasOwnProperty('dx')) {
		return cb(403, 'Missing dx argument');
	}
	if (!query.hasOwnProperty('dy')) {
		return cb(403, 'Missing dy argument');
	}

	var max_speed = configuration['max-ship-speed'];
	if ((query.dx * query.dx + query.dy * query.dy) > (max_speed * max_speed)) {
		return cb(403, 'You are too fast!');
	}

	client.public.dx = query.dx;
	client.public.dy = query.dy;

	cb(200, {});
};



var shoot = function(query, cb) {

	if (!query.hasOwnProperty('dx')) {
		return cb(403, 'Missing dx argument');
	}
	if (!query.hasOwnProperty('dy')) {
		return cb(403, 'Missing dy argument');
	}

	if (!query.hasOwnProperty('secret')) {
		return cb(403, 'Missing secret argument');
	}
	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, 'Unknown client');
	}
	var client = clients[query.secret];


	/* Check if last shot invokation was not long enough away
	 */
	var now = Date.now();
	if (now - client['last-shot'] < configuration['min-shoot-interval']) {
		return cb(403, 'Shoot cooldown unfinished (now: '+ now +', last: '+ client['last-shot'] +', '+ (now - client['last-shot']) +' too fast)');
	}
	client['last-shot'] = now;


	/* Shot will have a fixed speed
	 */
	var speed = Math.sqrt(query.dx * query.dx + query.dy * query.dy);
	query.dx = query.dx / speed * configuration['max-shot-speed'];
	query.dy = query.dy / speed * configuration['max-shot-speed'];


	/* Add new shot
	 */
	var shot = {
		public: {
			id: uuid.v4(),
			x: client.public.x,
			y: client.public.y,
			dx: query.dx,
			dy: query.dy
		},

		owner: query.secret,
		ticks: configuration['shot-ticks']
	};

	
	/* Propagate shot
	 */
	shots[uuid.v4()] = shot;
	broadcast('shot', shot.public);

	cb(200, shot.public);
};



var dump = function(query, cb) {
	pending_dumps.push(function() {
		cb(200, {
			clients: clients,
			shots: shots
		});
	});
};
var pending_dumps = [];



var is_alive = function(query, cb) {
	if (!query.hasOwnProperty('id')) {
		return cb(403, 'Missing id argument');
	}

	var alive = (function() {
		for (var secret in clients) {
			if (query.id === clients[secret].public.id) {
				return true;
			}
		}

		return false;
	})();

	cb(200, {
		'is-alive': alive
	});
};



/**
 * Possibility to kill yourself
 */
var suicide = function(query, cb) {
	if (!query.hasOwnProperty('secret')) {
		return cb(403, 'Missing secret argument');
	}
	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, 'Unknown client');
	}

	delete clients[query.secret];
	cb(200, {
		'message': 'Fucking moron'
	});
};



/**
 * Sends the GUI resource
 */
var gui = function(response) {
	var fs = require('fs');
	var path = require('path').join(__dirname, 'gui.html');

	fs.stat(path, function(err, stats) {
		if (err) throw err;

		response.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': stats.size
		});

		fs.createReadStream(path).pipe(response);
	});
};





/**
 * Update internal state
 */
var last_call = Date.now();
setInterval(function() {
	var now = Date.now();
	var elapsed = now - last_call;
	last_call = now;

	for (var secret in clients) {
		var client = clients[secret];
		var dx = client.public.dx * elapsed / 1000.0;
		var dy = client.public.dy * elapsed / 1000.0;

		client.public.x += dx;
		client.public.y += dy;

		if (		client.public.x > configuration['game-zone']
			||	client.public.x < -configuration['game-zone']
			||	client.public.y > configuration['game-zone']
			||	client.public.y < -configuration['game-zone']) {

			console.log('Client '+ clients[secret].public.name +' out of bounds');
			delete clients[secret];
		}
	}
	for (var id in shots) {
		var shot = shots[id];
		shot.ticks--;

		if (shot.ticks < 0) {
			delete shots[id];
		} else {
			shot.public.x += shot.public.dx * elapsed / 1000.0;
			shot.public.y += shot.public.dy * elapsed / 1000.0;

			/* @warning Not correct but fast, will have to check
			 *     minimum distance of line segment to ships
			 */
			for (var secret in clients) {
				var client = clients[secret];
				var dx = client.public.x - shot.public.x;
				var dy = client.public.y - shot.public.y;

				var distance_sqr = dx * dx + dy * dy;
				var radius_sqr = configuration['ship-radius'] * configuration['ship-radius'];

				if (distance_sqr <= radius_sqr) {
					console.log('Client '+ client.public.name +' killed by '+ shot.owner);
					delete clients[secret];
				}
			}
		}
	}

	/* Send pending dump requests
	 */
	var dumps = pending_dumps;
	pending_dumps = [];

	for (var i = 0; i < dumps.length; ++i) {
		dumps[i]();
	}
}, 234);



/**
 * Propagate information to clients
 */
setInterval(function() {
	return;

	for (var secret in clients) {
		broadcast('client', clients[secret].public);
	}
	for (var id in shots) {
		broadcast('shot', shots[id].public);
	}
}, 500);





http.createServer(function(request, response) {
	var action = url.parse(request.url, true);

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


	if ('/radar' === action.pathname) {
		radar(action.query, send);
	} else if ('/move' === action.pathname) {
		move(action.query, send);
	} else if ('/shoot' === action.pathname) {
		shoot(action.query, send);
	} else if ('/connect' === action.pathname) {
		action.query['udp-ip'] = request.connection.remoteAddress;
		connect(action.query, send);
	} else if ('/is-alive' === action.pathname) {
		is_alive(action.query, send);
	} else if ('/configuration' === action.pathname) {
		send(200, configuration);
	} else if ('/suicide' === action.pathname) {
		suicide(action.query, send);
	} else if ('/dump' === action.pathname) {
		dump(action.query, send);
	} else if ('/' === action.pathname) {
		gui(response);
	} else {
		send(404, 'Unknown method');
	}
}).listen(31339);

