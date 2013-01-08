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

var fs = require('fs');
var path = require('path');





/**
 * Not really a command, simply ships the gui.html resource for convenience
 */
module.exports = function(game, response) {
	response = response.response();
	var file = path.join(__dirname, 'gui.html');

	/* @warning Inform client if an error occurs (end response)
	 */
	fs.stat(file, function(err, stats) {
		if (err) throw err;

		response.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': stats.size
		});

		fs.createReadStream(file).pipe(response);
	});
};

