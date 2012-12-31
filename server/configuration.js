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



/**
 * Game mechanic configuration
 */
module.exports = function(_properties) {

	this.getMaxShipSpeed = function() {
		return _properties['max-ship-speed'];
	};

	this.getMaxShotSpeed = function() {
		return _properties['max-shot-speed'];
	};

	this.getShipRadius = function() {
		return _properties['ship-radius'];
	};	

	this.getMinRadarInterval = function() {
		return _properties['min-radar-interval'];
	};	

	this.getMinShootInterval = function() {
		return _properties['min-shoot-interval'];
	};	



	this.getSpawnZone = function() {
		return _properties['spawn-zone'];
	};	

	this.getGameZone = function() {
		return _properties['game-zone'];
	};	

	this.getShopTicks = function() {
		return _properties['shot-ticks'];
	};	







		'max-ship-speed':	25,
		'':	250,
		'':	10,
		'': 500,
		'': 2500
	},

	/* Internal
	 */	
	'':	500,
	'':	1000,
	'':	100

};

