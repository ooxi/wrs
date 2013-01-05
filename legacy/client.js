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
﻿var http = require('./http-fuckup.js');
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

	/* Exception callback can be overwritten
	 */
	var exception_cb = function(exception) {
		throw exception;
	};
	if (arguments.length >= 2) {
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
 * Update configuration
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
	var url = server_url +'connect?name='+ e(name) +'&udp-port='+ e(udp_port);

	http.get(url, read_object(function(response) {

		/* Activate radar
		 */
		response.radar = {
			'nearby-clients': {},
			'nearby-shots': {}
		};

		setInterval(function() {
			do_radar(response.secret, function(echo) {
				response.radar = echo;
			}, function(exception) {
				console.log('Radar ignored: '+ exception);
			});
		}, configuration['min-radar-interval'] + 25);


		ships.push(response.secret);
		cb(response);
	})).on('error', function(e) {
		console.log('Connection to %j failed', url);
		throw e;
	});
};



/**
 * Change speed and direction of client
 */
var do_move = function(secret, dx, dy, cb) {
	http.get(server_url +'move?secret='+ e(secret) +'&dx='+ e(dx) +'&dy='+ e(dy), read_object(function(response) {
		cb();
	}));
};



/**
 * Shoots
 */
var do_shoot = function(secret, dx, dy, cb) {
	http.get(server_url +'shoot?secret='+ e(secret) +'&dx='+ e(dx) +'&dy='+ e(dy), read_object(function(response) {
		cb();
	}, function(exception) {
		console.log('Shot failed: %j', exception);
	}));
};



/**
 * Chooses another random client or waits until a new player appears
 */
var get_random_enemy = function(self, cb) {

	var check = function() {
		if ('undefined' === typeof(self.radar.me)) {
			return null;
		}
		var ids = Object.keys(self.radar['nearby-clients']);

		var id = ids[parseInt(Math.floor(Math.random() * ids.length))];
		return self.radar['nearby-clients'][id];
	};

	var interval = setInterval(function() {
		var enemy = check();

		if (null !== enemy) {
			console.log('Chose '+ enemy.id +' as enemy ');
			clearInterval(interval);
			cb(enemy);
		} else {
			console.log('No enemy found');
		}
	}, 500);
};



/**
 * Fliegt direkt auf ein gegnerisches Schiff zu
 */
var follow = function(self, enemy) {
	if ('undefined' === self.radar.me) {
		console.log('I don\'t know myself');
		return;
	}
	var me = self.radar.me;

	var dx = enemy.x - me.x;
	var dy = enemy.y - me.y;
	var len = Math.sqrt(dx * dx + dy * dy);

	dx = dx / len * (configuration['max-ship-speed'] - 0.0001);
	dy = dy / len * (configuration['max-ship-speed'] - 0.0001);

	do_move(self.secret, dx, dy, function() {});
};



/**
 * Schiesst auf den aktuellen Standort eines gegnerischen Schiffes
 */
var shoot_at = function(self, enemy) {
	if ('undefined' === self.radar.me) {
		console.log('I don\'t know myself');
		return;
	}
	var me = self.radar.me;

	var dx = enemy.x - me.x;
	var dy = enemy.y - me.y;
	var len = Math.sqrt(dx * dx + dy * dy);

	dx = dx / len * (configuration['max-shot-speed'] - 0.0001);
	dy = dy / len * (configuration['max-shot-speed'] - 0.0001);

	do_shoot(self.secret, dx, dy, function() {});
};





/* Erschaffe einen neuen Bot und waehle ein zufaelliges Target nach 0.5s
 */
do_connect('volker-'+ Math.random(), function(client) {
	var enemy_id = null;
	var waiting_for_enemy = false;


	/* If an enemy is chosen, that one will be followed. If not a new one
	 * gets chosen
	 */
	var follow_chosen_enemy = function() {
		
		/* No enemy chosen (or enemy does not exist anymore)
		 */
		if ((null === enemy_id) || !client.radar['nearby-clients'].hasOwnProperty(enemy_id)) {

			/* Move to random direction
			 */
			var direction = util.random_direction(configuration['max-ship-speed'] - 0.0001);
			do_move(client.secret, direction.x, direction.y, function() {});
			console.log('No enemy');		

			/* And choose new enemy
			 */
			if (!waiting_for_enemy) {
				waiting_for_enemy = true;
				get_random_enemy(client, function(new_enemy) {
					enemy_id = new_enemy.id;
					waiting_for_enemy = false;

					console.log(client.radar.me.name +' will follow '+ new_enemy.name);
					follow_chosen_enemy();
				});
			}

		/* Follow that enemy :-)
		 */
		} else {
			var enemy = client.radar['nearby-clients'][enemy_id];
			follow(client, enemy);
			shoot_at(client, enemy);
		}
	};


	setInterval(function() {
		follow_chosen_enemy();
	}, configuration['min-shoot-interval'] + 25);
});



/* Erschaffe einen neuen Bot und fliege im Kreis mit einem zufaelligen Radius
 */
do_connect('vagina-'+ Math.random(), function(client) {

	var interval = setInterval(function() {
		var direction = util.random_direction(configuration['max-ship-speed'] - 0.0001);
		console.log('Vagina '+ client.radar.me.name +' moves to %j', direction);
		do_move(client.secret, direction.x, direction.y, function() {}, function(exception) {
			console.log('Vagina died: '+ exception);
			clearInterval(interval);
		});
	}, 2000);
});

