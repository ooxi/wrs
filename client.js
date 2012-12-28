var http = require('http');
var dgram = require('dgram');

var server_url = 'http://localhost:31337/';
var udp_port = 54321;



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
 */
var self = [];
var clients = {};
var shots = {};



/* Register socket for udp updates
 */
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




/**
 * Register a new client
 */
var do_connect = function(name, cb) {
	http.get(server_url +'connect?name='+ encodeURIComponent(name) +'&udp-port='+ encodeURIComponent(udp_port), read_object(function(response) {

		self.push(response.secret);
		cb();
	}));
};



do_connect('volker-'+ Math.random(), function() {
});



/*
var name = "boris-"+ Math.random();
http.get("http://localhost:1337/connect?name="+ encodeURIComponent(name), read_object(function(response) {
	var secret = response.secret;

	var dx = 10.0 * (Math.random() - 0.5);
	var dy = 10.0 * (Math.random() - 0.5);
	http.get("http://localhost:1337/move?secret="+ encodeURIComponent(secret) +"&dx="+ encodeURIComponent(dx) +"&dy="+ encodeURIComponent(dy), read_object(function(response) {
	}));

	http.get("http://localhost:1337/radar?secret="+ encodeURIComponent(secret), read_object(function(response) {
		console.log("%j", response);
	}));

	setTimeout(function() {
		http.get("http://localhost:1337/shoot?secret="+ encodeURIComponent(secret), read_object(function(response) {
			console.log("Shot!");
		}));
	}, 2050);
}));
*/

