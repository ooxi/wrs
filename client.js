var http = require("http");

var read_object = function(cb) {
	return function(response) {
		var message = [];

		response.on("data", function(chunk) {
			message += chunk
		});
		response.on("end", function() {
			var obj = JSON.parse(message);

			if (200 != response.statusCode) {
				throw obj.message;
			} else {
				cb(obj);
			}
		});
	};
};


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
