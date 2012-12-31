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
 * 
 */
module.exports = function(_api, _name, _color, cb) {

	/**
	 * Reference to self
	 */
	var _that = this;

	/**
	 * Public and private keys
	 */
	var _public_key = undefined;
	var _private_key = undefined;



	this.name = function() {
		return _name;
	};

	this.color = function() {
		return _color;
	};

	this.public_key = function() {
		return _public_key;
	};

	this.private_key = function() {
		return _private_key;
	};





	/**
	 * Constructor
	 */
	(function() {
		api.team(_that.name(), _that.color(), function(result) {
			_public_key = result['public-key'];
			_private_key = result['private-key'];
			cb(_that);
		});
	})();
};








