'use strict';

var dgram = require('dgram');
var http = require('http');
var url = require('url');
var uuid = require('./uuid.js');
var util = require('./util.js');

var configuration = require('./configuration.js');
var clients = {};
var shots = {};





/**
 * Used to propagate an object to all clients
 */
var broadcast_socket = dgram.createSocket('udp4');

var broadcast = function(type, obj) {
	for (var secret in clients) {
		var client = clients[secret];

		var msg = new Buffer(JSON.stringify({
			type: type,
			secret: secret,
			payload: obj
		}));

		broadcast_socket.send(
			msg, 0, msg.length,
			client['udp-port'], client['udp-ip'],
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

	/* Needing port to contact with UDP information (ip will be set in the
	 * server, not by the client)
	 */
	if (!query.hasOwnProperty('udp-ip')) {
		return cb(403, 'Missing udp-ip argument');
	}
	if (!query.hasOwnProperty('udp-port')) {
		return cb(403, 'Missing udp-port argument');
	}


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

		/* UDP information
		 */
		'udp-ip': query['udp-ip'],
		'udp-port': query['udp-port'],

		/* Time of last shot
		 */
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
	var nearby_clients = [];
	var nearby_shots = [];

	for (var secret in clients) {
		if (secret !== query.secret) {
			nearby_clients.push(clients[secret].public);
		}
	}
	for (var uuid in shots) {
		nearby_shots.push(shots[uuid].public);
	}

	cb(200, {
		me: client.public,
		nearby_clients: nearby_clients,
		nearby_shots: nearby_shots
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

	var max_speed = 5.0;
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


	/* Shot must not be too fast
	 */
	var speed_sqr = query.dx * query.dx + query.dy * query.dy;
	var max_speed_sqr = configuration['max-shot-speed'] * configuration['max-shot-speed'];

	if (speed_sqr > max_speed_sqr) {
		return cb(403, 'Shot is too fast');
	}


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
	cb(200, {
		clients: clients,
		shots: shots
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

		
	}
	for (var id in shots) {
		var shot = shots[id];
		shot.ticks--;

		if (shot.ticks < 0) {
			delete shots[id];
		} else {
			shot.x += shot.dx * elapsed / 1000.0;
			shot.y += shot.dy * elapsed / 1000.0;
		}
	}
}, 500);



/**
 * Propagate information to clients
 */
setInterval(function() {
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
	} else if ('/configuration' === action.pathname) {
		send(200, configuration);
	} else if ('/dump' === action.pathname) {
		dump(action.query, send);
	} else {
		send(404, 'Unknown method');
	}
}).listen(31337);

