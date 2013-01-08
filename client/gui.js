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
	fs:	require('fs'),
	http:	require('http'),
	path:	require('path'),
	url:	require('url')
};





/**
 * HTTP server exporting internal AI state
 */
module.exports = function(_ai, port) {

	/**
	 * Self reference
	 */
	var _that = this;



	/**
	 * Objects to draw in current tick
	 */
	var _objects = undefined;

	/**
	 * Color name cache
	 */
	var _colors = undefined;

	/**
	 * Listeners waiting for current tick to finish
	 */
	var _listeners = [];





	/**
	 * Starts a new tick by resetting objects to draw. Meanwhile the last
	 * tick objects will be send to all waiting clients.
	 */
	this.tick = function() {
		/* Reset internal objects
		 */
		var objects = _objects;
		var listeners = _listeners;

		_objects = {
			'colors':	[],
			'circles':	[],
			'arrows':	[]
		};

		_colors = {
			null:	0,
		};

		_listeners = [];


		/* Send objects from last tick to waiting listeners
		 */
		if (('undefined' === typeof(objects)) || (0 === listeners.length)) {
			return;
		}

		for (var i = 0; i < listeners.length; ++i) {
			listeners[i].end(JSON.stringify(objects));
		}
	};





	/**
	 * @return Color index
	 */
	this.color = function(name) {
		if (_colors.hasOwnProperty(name)) {
			return _colors[name];
		};

		var index = _objects.colors.length;
		_objects.colors.push(name);
		_colors[name] = index;

		return index;
	};



	/**
	 * Adds a circle
	 */
	this.circle = function(center, radius, fill, stroke) {
		if ('undefined' === typeof(_objects)) {
			console.log('[gui] Call to circle between ticks');
		}

		_objects.circles.push([
			center.x,
			center.y,
			radius,
			_that.color(fill),
			_that.color(stroke)
		]);
	};



	/**
	 * Adds an arrow
	 */
	this.arrow = function(from, to, stroke) {
		_objects.arrows.push([
			from.x,
			from.y,
			to.x,
			to.y,
			_this.color(stroke)
		]);
	};





	/**
	 * Setup HTTP server
	 */
	(function() {
		_that.tick();

		node.http.createServer(function(request, response) {
			var url = node.url.parse(request.url, true);


			/* Register client for next tick
			 */
			if ('/listen' === url.pathname) {
				response.writeHead(200, {'Content-Type': 'application/json'});
				_listeners.push(response);


			/* Send GUI bootstrap code
			 */
			} else if ('/' === url.pathname) {
				var file = node.path.join(__dirname, 'gui.html');

				node.fs.stat(file, function(err, stats) {
					if (err) throw err;

					response.writeHead(200, {
						'Content-Type': 'text/html',
						'Content-Length': stats.size
					});

					node.fs.createReadStream(file).pipe(response);
				});


			/* Send game configuration
			 */
			} else if ('/configuration' === url.pathname) {
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify(_ai.configuration));


			/* Unknown method
			 */
			} else {
				response.writeHead(403, {'Content-Type': 'application/json'});
				response.end(JSON.stringify({
					error:	'Unknown method',
					method:	url.pathname
				}));
			}
		}).listen(port);
	})();
};





















