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

var wrs = {
	movement:	require('./movement.js'),
	orbit:		require('./orbit.js'),
	teams:		require('./teams.js')
};





/**
 * Aggregates game related modules
 */
module.exports = function(_configuration) {

	/* Independend objects
	 */
	this.configuration = _configuration;
	this.orbit = new wrs.orbit();
	this.teams = new wrs.teams();

	/* Dependend objects
	 */
	this.movement = new wrs.movement(this);



	/**
	 * Calculate next text
	 */
	this.tick = function() {
		this.movement.move();

		/* Remove all dead objects from the game
		 */
		var to_remove = [];

		this.orbit.each(function(obj) {
			if (obj.health < 0.00001) {
				console.log('[game] Dead object '+ obj.public_key +' will be removed from game');
				to_remove.push(obj);
			}
		});

		for (var i = 0; i < to_remove.length; ++i) {
			this.orbit.remove.public(to_remove[i].public_key);
		}
	};



	/**
	 * Deal damage to an object in the game
	 *
	 * @param what Object to be harmed
	 * @param damage Damage to be dealt
	 * @param aggressor Object responsible for attack
	 */
	this.hit = function(what, damage, aggressor) {
		what.health -= damage;
		console.log('[game] '+ aggressor.public_key +' dealt '+ damage +' to '+ what.public_key);
	};

};







