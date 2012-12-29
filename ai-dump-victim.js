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
var configuration = require('./configuration.js');
var ship = require('./ship.js');



/**
 * A simple victim doing a random walk
 */
module.exports = function() {

	/* Every victim has a ship, till it die
	 */
	var _ship = new ship('victim-'+ Math.random());




	
	/**
	 * Flies to the next point a view seconds away
	 */	
	var fly_random = function() {
		var position = _ship.position();
		position.x += configuration['max-ship-speed'] * 5.0 * (Math.random() - 0.5);
		position.y += configuration['max-ship-speed'] * 5.0 * (Math.random() - 0.5);

		_ship.fly_to(position.x, position.y, function() {
			console.log('Reached %j', position);
			fly_random();
		});
	};



	/**
	 * Moves the ship
	 */
	this.move = function() {
		_ship.move();
	};





	/**
	 * Constructor
	 */
	(function() {
		fly_random();
	})();
};











