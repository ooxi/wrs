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
var optimist = require('optimist');

var wrs = {
	api:		require('./api.js'),
	client:		'dump-victim',
	version:	'0.1-beta'
};




/* Initialization has to be done in sequence
 */
async.waterfall([

	/**
	 * Parse arguments
	 */
	function(cb) {
		cb(null, optimist
			.default('server-url', 'http://localhost:31337/')
			.argv
		);
	},


	/**
	 * Initialize API
	 */
	function(argv, cb) {
		cb(null, new wrs.api(argv['server-url']));
	},


	/**
	 * Register team
	 */
	function(api, cb) {
		
		cb(null);
	},



/* Inform client of setup success or failure
 */
], function(err) {
	if (err) throw err;
	cosole.log('Dump victims client up and running...');
});






