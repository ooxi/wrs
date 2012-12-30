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
var ai_dumb_mob = require('./ai-dumb-mob.js');
var ai_dumb_victim = require('./ai-dumb-victim.js');
var ship = require('./ship.js');
var ships = require('./ships.js');
var util = require('./util.js');



var do_rectangle = function() {
	s.fly_by_wire([
		new util.point(300.0, 300.0),
		new util.point(300.0, -300.0),
		new util.point(-300.0, -300.0),
		new util.point(-300.0, 300.0)
	], do_rectangle);
};
var s = new ship('rectangle-'+ Math.random(), function() {
	do_rectangle();
});

var left_right = new ship('left-right-'+ Math.random(), function() {
	left_right.fly_to(-1000.0, 0.0, function() {
		left_right.fly_to(1000.0, 0.0);
	});
});




var victims = (function() {
	var ais = [];

	for (var i = 0; i < 10; ++i) {
		ais.push(new ai_dumb_victim(
			new ship('ai-dumb-victim-'+ Math.random(), function() {})
		));
	}

	return ais;
})();



var dumb_mob = [
	new ship('ai-dumb-mob-0-'+ Math.random(), function() {}),
	new ship('ai-dumb-mob-1-'+ Math.random(), function() {}),
	new ship('ai-dumb-mob-2-'+ Math.random(), function() {}),
	new ship('ai-dumb-mob-3-'+ Math.random(), function() {})
];
var dumb_mob_ai = {
	move: function() {}
};

setTimeout(function() {
	var current_victim = 0;

	var kill_next_victim = function() {
		var victim_id = ships.get_random_victim_id();

		if (null === victim_id) {
			console.log('All vicitims killed :-)');
			return;
		}

		console.log('Dumb mob now tries to kill '+ victim_id);
		dumb_mob_ai = new ai_dumb_mob(dumb_mob, victim_id, kill_next_victim);
	};

	kill_next_victim();
}, 2500);



/*
var s = new ship('roland-'+ Math.random());
s.fly_to(-300.0, -300.0, function() {
	console.log('point a');
	s.fly_to(300.0, -300.0, function() {
		console.log('point b');
		s.fly_to(300.0, 300.0, function() {
			console.log('point c');
			s.fly_to(-300.0, 300.0, function() {
				console.log('done :-)');
			});
		});
	});
});
*/

setInterval(function() {
	s.move();

	for (var i = 0; i < victims.length; ++i) {
		victims[i].move();
	}

	dumb_mob_ai.move();
}, 500);






