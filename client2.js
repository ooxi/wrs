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
var ai_dump_mob = require('./ai-dump-mob.js');
var ai_dump_victim = require('./ai-dump-victim.js');
var ship = require('./ship.js');
var util = require('./util.js');



var do_rectangle = function() {
	s.fly_by_wire([
		new util.point(100.0, 100.0),
		new util.point(100.0, -100.0),
		new util.point(-100.0, -100.0),
		new util.point(-100.0, 100.0)
	], do_rectangle);
};
var s = new ship('rectangle-'+ Math.random(), function() {
	do_rectangle();
});




var victims = (function() {
	var ais = [];

	for (var i = 0; i < 10; ++i) {
		ais.push(new ai_dump_victim(
			new ship('ai-dump-victim-'+ Math.random(), function() {})
		));
	}

	return ais;
})();



var dump_mob = [
	new ship('ai-dump-mob-0-'+ Math.random(), function() {}),
	new ship('ai-dump-mob-1-'+ Math.random(), function() {}),
	new ship('ai-dump-mob-2-'+ Math.random(), function() {}),
	new ship('ai-dump-mob-3-'+ Math.random(), function() {})
];
var ai_dump_mob = {
	move: function() {}
};

setTimeout(function() {
	var current_victim = 0;

	var kill_next_victim = function() {
		if (current_victim >= victims.length) {
			console.log('All victims killed :-)');
			return;
		}

		var victim_id = victims[current_victim].public_key;
		++current_victim;

		console.log('Dump mob now tries to kill '+ victim_id);
		ai_dump_mob = new ai_dump_mob(dumb_mob, victim_id, kill_next_victim);
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

	ai_dump_mob.move();
}, 500);






