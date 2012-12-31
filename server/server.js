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

var async = require('async');
var fs = require('fs');
var optimist = require('optimist');

var wrs = {
	configuration:	require('./configuration.js'),
	http:		require('./http.js'),
	orbit:		require('./orbit.js'),
	version:	'2.1-beta'
};





/**
 * Execute initialization one by one
 */
async.waterfall([

	/**
	 * Parse command line arguments
	 */
	function(cb) {
		cb(null, optimist
			.default('configuration', 'configuration.json')
			.describe('configuration', 'Path to configuration.json file')
			.argv
		);
	},


	/**
	 * Load configuration file
	 */
	function(argv, cb) {
		fs.readFile(argv.configuration, 'UTF-8', function(err, data) {
			if (err) {
				cb(err);
			} else {
				cb(null, data)
			}
		});
	},


	/**
	 * Parse configuration file
	 */
	function(data, cb) {

		/* Strip comments (not part of json)
		 */
		data = data.replace(/[/](.|[\s])*?[/]/gm, '');

		var properties = JSON.parse(data);
		var configuration = new wrs.configuration(properties);
		cb(null, configuration);
	},


	/**
	 * Initialize game management subsystems
	 */
	function(configuration, cb) {
		var orbit = new wrs.orbit();
		var http = new wrs.http(configuration);
	}


/**
 * Tell client if setup was successful
 */	
], function(err) {
	if (err) throw err;
	console.log('WRS '+ wrs.version +' up and running :-)');
});









