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
 * Export public utility functions
 */
module.exports = function(_query, _response) {

	/**
	 * Reference to self
	 */
	var _that = this;



	/**
	 * @return _query
	 */
	this.query = function(key) {
		if ('string' === typeof(key)) {
			return _query[key];
		}
		return _query;
	};

	/**
	 * @return _response
	 */
	this.response = function() {
		return _response;
	};





	/**
	 * Sends an error message
	 */
	this.error = function(status, message) {
		if ('string' !== typeof(message)) {
			throw 'Message must be a string';
		}

		_that.json(status, {
			error: true,
			message: message

		});
	};



	/**
	 * Sends a JSON message
	 */
	this.json = function(status, obj) {
		if ('object' !== typeof(obj)) {
			throw 'JSON data must be an object';
		}
		response.writeHead(status, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(obj));
	}



	/**
	 * Checks if all required arguments are present. If at least one is not,
	 * the response will be terminated with an error
	 */
	this.require = function(args) {
		for (var i = 0; i < args.length; ++i) {
			if (!_query.hasOwnProperty(args[i])) {
				_that.error(403, 'Missing `'+ args[i] +'\' argument');
				return false;
			}
		}

		return true;
	};

};












