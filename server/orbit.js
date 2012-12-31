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
	 * The objects by public key
	 *
	 * @warning Currenlty a map for fast name based access, a quadtree for
	 *     fast location based access should be added, too
	 */
	var _objects_by_public_key = new wrs.orbit.by_identifier('public_key');

	/**
	 * The objects by private key
	 */
	var _objects_by_private_key = new wrs.orbit.by_identifier('private_key');





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

};

