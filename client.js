var http = require('http');
var dgram = require('dgram');
var configuration = require('./configuration.js');
var util = require('./util.js');

var e = encodeURIComponent;
var server_url = 'http://localhost:31339/';
var udp_port = parseInt(10000 + Math.floor(Math.random() * 50000));



/**
 * Parses a JSON object from a http response
 */
var read_object = function(cb) {
	return function(response) {
		var message = [];

		response.on("data", function(chunk) {
			message += chunk
		});
		response.on("end", function() {
			var obj = JSON.parse(message);

			if (200 != response.statusCode) {
				throw 'Received unexpected exception: '+ obj.message;
			} else {
				cb(obj);
			}
		});
	};
};

/**
 * Konfiguration aktualisieren
 */
http.get(server_url +'configuration', read_object(function(response) {
	configuration = response;
}));





/* Register socket for udp updates
 *
var socket = dgram.createSocket('udp4');

socket.on('message', function(msg, rinfo) {
	var obj = JSON.parse(msg);

	if ('shot' === obj.type) {
		var shot = obj.payload;
		shots[shot.id] = shot;
	} else if ('client' === obj.type) {
		var client = obj.payload;
		clients[client.id] = client;
	} else {
		throw 'Unknown type';
	}
});
socket.bind(udp_port);
 */



/* Own ships
 */
var ships = [];





/**
 * Aktualisiert die Gegener und Schusspositionen
 */
var do_radar = function(secret, cb) {
	http.get(server_url +'radar?secret='+ e(secret), read_object(function(response) {
		cb(response);
	}));
};



/**
 * Register a new client
 */
var do_connect = function(name, cb) {
	http.get(server_url +'connect?name='+ e(name) +'&udp-port='+ e(udp_port), read_object(function(response) {

		/* Activate radar
		 */
		setInterval(function() {
			do_radar(response.secret, function(echo) {
				response.radar = echo;
			});
		}, 200);

		ships.push(response.secret);
		cb(response);
	}));
};



/**
 * Change speed and direction of client
 */
var do_move = function(secret, dx, dy, cb) {
	http.get(server_url +'move?secret='+ e(secret) +'&dx='+ dx +'&dy='+ dy, read_object(function(response) {
		cb();
	}));
};



/**
 * Chooses another random client or waits until a new player appears
 */
var get_random_enemy = function(self, cb) {

	var check = function() {
		if ('undefined' === typeof(self.radar)) {
			return null;
		}
		var ids = Object.keys(self.radar['nearby-clients']);

		var id = ids[parseInt(Math.floor(Math.random() * ids.length))];
		return self.radar['nearby-clients'][id];
	};


	var interval = setInterval(function() {
		var enemy = check();

		if (null !== enemy) {
			console.log('Chose '+ enemy.id +' as enemy');
			clearInterval(interval);
			cb(enemy);
		} else {
			console.log('No enemy found');
		}
	}, 500);
};



/**
 */
var follow = function(self, enemy) {
	if ('undefined' === self.radar) {
		console.log('I don\'t know myself');
		return;
	}
	var me = self.radar.me;

	var dx = me.x - enemy.x;
	var dy = me.y - enemy.y;
	var len = Math.sqrt(dx * dx + dy * dy);
	
	dx = dx / len * (configuration['max-ship-speed'] - 0.0001);
	dy = dy / len * (configuration['max-ship-speed'] - 0.0001);

	console.log('Changing direction to '+ dx +':'+ dy);
	do_move(self.secret, dx, dy, function() {});
};





/* Erschaffe einen neuen Bot und waehle ein zufaelliges Target nach 0.5s
 */
do_connect('volker-'+ Math.random(), function(client) {
	var direction = util.random_direction(configuration['max-ship-speed'] - 0.0001);
	do_move(client.secret, direction.x, direction.y, function() {
	});

	get_random_enemy(client, function(enemy) {
		follow(client, enemy);

		setInterval(function() {
			follow(client, enemy);
		}, 100);
	});
});



/* Erschaffe einen neuen Bot und fliege im Kreis mit einem zufaelligen Radius
 */
do_connect('vagina-'+ Math.random(), function(client) {

	setInterval(function() {
		var direction = util.random_direction(configuration['max-ship-speed'] - 0.0001);
		do_move(client.secret, direction.x, direction.y, function() {
		});
	}, 2000);

	

//	var center = {
//		x: util.random(configuration['game-zone'] - radius),
//		y: util.random(configuration['game-zone'] - radius)
//	};

//	go_to
});

