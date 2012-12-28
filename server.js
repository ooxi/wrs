"use strict";

var http = require("http");
var url = require("url");
var uuid = require("./uuid.js");

var clients = {};
var shots = {};





var connect = function(query, cb) {
	if (!query.hasOwnProperty("name")) {
		return cb(403, "Missing name argument");
	}
	for (var secret in clients) {
		if (clients[secret].public.name === query.name) {
			return cb(403, "Client with that name already exists");
		}
	}

	var secret = uuid.v4();
	clients[secret] = {
		public: {
			name: query.name,
			x: (Math.random() - 0.5) * 1000.0,
			y: (Math.random() - 0.5) * 1000.0,
			dx: 0.0,
			dy: 0.0
		}
	};

	cb(200, {
		secret: secret
	});
};



var radar = function(query, cb) {
	if (!query.hasOwnProperty("secret")) {
		return cb(403, "Missing secret argument");
	}

	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, "Unknown client");
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
	if (!query.hasOwnProperty("secret")) {
		return cb(403, "Missing secret argument");
	}

	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, "Unknown client");
	}
	var client = clients[query.secret];


	if (!query.hasOwnProperty("dx")) {
		return cb(403, "Missing dx argument");
	}
	if (!query.hasOwnProperty("dy")) {
		return cb(403, "Missing dy argument");
	}

	var max_speed = 5.0;
	if ((query.dx * query.dx + query.dy * query.dy) > (max_speed * max_speed)) {
		return cb(403, "You are too fast!");
	}

	client.public.dx = query.dx;
	client.public.dy = query.dy;

	cb(200, {});
};



var shoot = function(query, cb) {
	if (!query.hasOwnProperty("secret")) {
		return cb(403, "Missing secret argument");
	}

	if (!clients.hasOwnProperty(query.secret)) {
		return cb(404, "Unknown client");
	}
	var client = clients[query.secret];


	shots[uuid.v4()] = {
		public: {
			x: client.public.x,
			y: client.public.y,
			dx: client.public.dx * 5,
			dy: client.public.dy * 5
		},

		owner: query.secret,
		ticks: 100
	};

	cb(200, {});
};



var dump = function(query, cb) {
	cb(200, {
		clients: clients,
		shots: shots
	});
};





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
			shot.x += shot.dx;
			shot.y += shot.dy;
		}
	}
}, 10);



http.createServer(function(request, response) {
	var action = url.parse(request.url, true);

	var send = function(status, obj) {
		response.writeHead(status, {"Content-Type": "application/json"});

		if ((200 !== status) && ("string" === typeof(obj))) {
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
		connect(action.query, send);
	} else if ('/udp' === action.pathname) {
		
	} else if ('/dump' === action.pathname) {
		dump(action.query, send);
	} else {
		send(404, 'Unknown method');
	}
}).listen(1337);

