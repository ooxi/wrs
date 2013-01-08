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





/**
 * Module registration
 */
module.exports = new (function() {

	

})();


/**
 * Selects the client AI to load
 *
var registered_ais = {
	'dumb-mob':	'./client/dumb-mob.js',
	'dumb-victims':	'./client/dumb-victims.js',
	'heinz':	'./client/heinz.js'
};


/* Check whether an AI is given
 *
if (process.argv.length < 3) {
	console.log('Usage: client <%j>', Object.keys(registered_ais));
	return;
}
var ai_name = process.argv[2];


/* Does requested AI exist?
 *
if (!registered_ais.hasOwnProperty(ai_name)) {
	console.log('Unkown AI %j, needs to be an element of %j', ai_name, Object.keys(registered_ais));
	return;
}


/* Load and execute AI
 *
require(registered_ais[ai_name]);

