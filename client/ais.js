/**
 * Copyright (c) 2013 github/ooxi
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
	fs:	require('fs')
};





/**
 * Auto registers all available AIs
 */
module.exports = function(cb) {

	/**
	 * Self reference
	 */
	var _that = this;

	/**
	 * Registered AIs
	 */
	var _ais = {};





	/**
	 * Loads a registered AI by name
	 *
	 * @warning Does not create an instance
	 */
	this.load = function(name) {
		if (!_ais.hasOwnProperty(name)) {
			throw new Error('Unknown AI '+ name);
		}

		return _ais[name];
	};





	/**
	 * Constuctor
	 */
	(function() {

		/* All JavaScript files beneath ./ai are assumed to contain
		 * exactly one AI
		 */
		node.fs.readdir('./ai', function(err, files) {
			if (err) throw err;
			var pattern = new RegExp('^(.+)\\.js$', 'i');

			for (var i = 0; i < files.length; ++i) {
				var file = files[i];
				var match = pattern.exec(file);

				if (match) {
					var ai_name = match[1];
					var ai_file = match[0];
					console.log('[ais] Will register %j', ai_name);

					_ais[ai_name] = require('./ai/'+ ai_file);
				}
			}

			cb(_that);
		});
	})();
};

