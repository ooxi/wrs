﻿/**
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
	http:	require('http'),
	url:	require('url')
};





/**
 * Emulating http.get via http.request
 */
var http_get = function(url, cb) {
	var options = {
		hostname: 'www.google.com',
		port: 80,
		path: '/',
		method: 'GET'
	};

	console.log(node.url.parse(url));
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
};


http_get('http://www.google.com', function(response) {
	console.log(response.statusCode);
});


/**
 * This should definitly not be necessary! But somehow http.get fails on my
 * machine while http.request does not o_O
 */
module.exports = {
	get:		http_get,
	request:	node.http.request
};

