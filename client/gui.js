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

var node = {
	http:	require('http')
};





/**
 * HTTP server exporting internal AI state
 */
module.exports = function(port) {

	/**
	 * Objects to draw in current tick
	 */
	var _objects = undefined;

	/**
	 * Color name cache
	 */
	var _colors = undefined;

	/**
	 * Requests waiting for current tick to finish
	 */
	var _requests = [];





	/**
	 * Starts a new tick by resetting objects to draw. Meanwhile the last
	 * tick objects will be send to all waiting clients.
	 */
	this.tick = function() {

		/* Reset internal objects
		 */
		var objects = _objects;
		var requests = _requests;

		_objects = {
			'colors':	[],
			'circles':	[],
			'arrows':	[]
		};

		_colors = {
			null:	0,
		};

		_requests = [];


		/* Send objects from last tick to waiting listeners
		 */
		if (('undefined' === typeof(objects)) || (0 === requests.length)) {
			return;
		}

		for (var i = 0; i < requests.length; ++i) {
			requests[i].end(JSON.stringify(objects));
		}
	};





	/**
	 * Adds a circle
	 */
	this.circle = function(center, radius, fill, stroke) {
		if ('undefined' === typeof(_objects)) {
			console.log('[gui] Call to circle between ticks');
		}

		_objects.circules.push([
			center.x,
			center.y,
			radius,
			_colors[fill],
			_colors[stroke]
		]);
	};

};





















