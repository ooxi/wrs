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

var Class = require('uberclass');

var wrs = {
	ai:	require('../ai.js')
};





/**
 * A dumb victim only tries to avoid getting destroyed by hitting the game
 * border
 */
module.exports = wrs.ai.extend({

	/**
	 * @return AI name
	 */
	getAiName: function() {
		return 'dumb-victim';
	},

	/**
	 * @return AI version
	 */
	getAiVersion: function() {
		return '0.2-beta';
	}

});












