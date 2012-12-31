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
	orbit: {
		identifier:	require('./orbit-by-identifier.js')
	}
};





/**
 * Manages objects like ships and shots in a universe
 */
module.exports = function() {

	/**
	 * The objects by public identifier
	 *
	 * @warning Currenlty a map for fast name based access, a quadtree for
	 *     fast location based access should be added, too
	 */
	var _objects = {};





	/**
	 * @return true iff object with given id exists
	 */
	this.exists = function(id) {
		return _objects.hasOwnProperty(id);
	};



	/**
	 * Adds a new object, must have at least the following properties `id',
	 * `x', `y', `dx', `dy'
	 */
	this.add = function(obj) {
		if (!obj.hasOwnProperty('id')) {
			throw 'Missing `id\' property';
		}
		if (!obj.hasOwnProperty('x')) {
			throw 'Missing `x\' property';
		}
		if (!obj.hasOwnProperty('y')) {
			throw 'Missing `y\' property';
		}
		if (!obj.hasOwnProperty('dx')) {
			throw 'Missing `dx\' property';
		}
		if (!obj.hasOwnProperty('dy')) {
			throw 'Missing `dy\' property';
		}

		_objects[obj.id] = obj;
	};



	/**
	 * @return object identified by id
	 */
	this.get = function(id) {
		if (!this.exists(id)) {
			throw 'Cannot return unknown object `'+ id +'\'';
		}
		return _objects[id];
	};



	/**
	 * Removes object
	 */
	this.remove = function(id) {
		if (!this.exists(id)) {
			throw 'Cannot remove unknown object `'+ id +'\'';
		}
		delete _objects[id];
	};
};

