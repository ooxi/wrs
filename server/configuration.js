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


	/**
	 * @return Half width of the quadratic game zone [m]
	 */
	this.getGameZone = function() {
		return _properties.public['game-zone'];
	};

	/**
	 * @return [m]
	 */
	this.getShipRadius = function() {
		return _properties.public['ship-radius'];
	};

	/**
	 * @return [m/s]
	 */
	this.getMaxShipSpeed = function() {
		return _properties.public['max-ship-speed'];
	};

	/**
	 * @return [m/s]
	 */
	this.getMaxShotSpeed = function() {
		return _properties.public['max-shot-speed'];
	};

	/**
	 * @return [ms]
	 */
	this.getMinRadarInterval = function() {
		return _properties.public['min-radar-interval'];
	};

	/**
	 * @return [ms]
	 */
	this.getMinShootInterval = function() {
		return _properties.public['min-shoot-interval'];
	};



	/**
	 * @return Half width of the quadratic spawn zone [m]
	 */
	this.getSpawnZone = function() {
		return _properties['spawn-zone'];
	};

	/**
	 * @return Number of ticks before a shot will be automatically deleted
	 */
	this.getShopTicks = function() {
		return _properties['shot-ticks'];
	};



	/**
	 * @return HTTP port
	 */
	this.getHttpPort = function() {
		return _properties['http-port'];
	};

};

