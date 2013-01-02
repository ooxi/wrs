﻿/**
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
	 * Self reference
	 */
	var _that = this;

	/**
	 * Required object keys
	 */
	var _required_keys = ['x', 'y', 'dx', 'dy', 'health', 'json', 'move'];

	/**
	 * The objects by public key
	 *
	 * @warning Currenlty a map for fast name based access, a quadtree for
	 *     fast location based access should be added, too
	 */
	var _objects_by_public_key = new wrs.orbit.identifier('public_key', _required_keys);

	/**
	 * The objects by private key
	 */
	var _objects_by_private_key = new wrs.orbit.identifier('private_key', _required_keys);





	/**
	 * Registers a new object
	 */
	this.add = function(obj) {
		_objects_by_public_key.add(obj);
		_objects_by_private_key.add(obj);
	};



	/**
	 * Check object existence
	 */
	this.exists = {
		public: function(public_key) {
			return _objects_by_public_key.exists(public_key);
		},

		private: function(private_key) {
			return _objects_by_private_key.exists(private_key);
		}
	};



	/**
	 * @return Object identified by key
	 */
	this.get = {
		public: function(public_key) {
			if (!_that.exists.public(public_key)) {
				throw new Error('Unknown public ship key `'+ public_key +'\'');
			}
			return _objects_by_public_key.get(public_key);
		},
		
		private: function(private_key) {
			if (!_that.exists.private(private_key)) {
				throw new Error('Unknown private ship key `'+ private_key +'\'');
			}
			return _objects_by_private_key.get(private_key);
		}	
	};



	/**
	 * Removes an object
	 */
	this.remove = {
		public: function(public_key) {
			var private_key = _that.get.public(public_key).private_key;
			_objects_by_public_key.remove(public_key);
			_objects_by_private_key.remove(private_key);
		},

		private: function(private_key) {
			var public_key = _that.get.private(private_key).public_key;
			_objects_by_public_key.remove(public_key);
			_objects_by_private_key.remove(private_key);
		}
	};



	/**
	 * Iterates over each object in space
	 */
	this.each = function(cb) {
		_objects_by_public_key.each(function(public_key, obj) {
			cb(obj);
		});
	};

};

