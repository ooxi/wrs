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

var wrs = {
	orbit: {
		identifier:	require('../common/orbit-by-identifier.js')
	}
};





/**
 * @see http://stackoverflow.com/a/9792947
 */
var remove_array_element = function(array, element) {
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i] === element) {
			array.splice(i, 1);
		}
	}
};





/**
 * By aggregating radar information in one place, we get more data :D
 */
module.exports = function(_api, _configuration) {

	/**
	 * All available api keys
	 */
	var _private_ship_keys = [];
	var _current_private_key = -1;

	/**
	 * Mapping from private to public keys
	 */
	var _private_to_public = new wrs.orbit.identifier('private_key', []);

	/**
	 * Most current radar information
	 */
	var _radar = {
		ships: {},
		shots: {}
	};



	/**
	 * Updates world state
	 */
	var update_radar = function() {
		if (0 === _private_ship_keys.length) {
			console.log('[radar] No private ship keys available');
			return;
		}

		/* Use next pirvate key
		 */
		++_current_private_key;
		if (_current_private_key >= _private_ship_keys.length) {
			_current_private_key = 0;
		}

		/* Update radar information
		 */
		var secret = _private_ship_keys[_current_private_key];
		_api.radar(secret, function(echo) {
			var new_radar = {
				client: echo['nearby-clients'],
				shot: echo['nearby-shots']
			};
			new_radar.client[echo.me.id] = echo.me;
			_radar = new_radar;
		}, function(exception) {
			console.log('[radar] Failed receiving radar information with '+ secret +': '+ exception);

			/* Check if client if dead
			 */
			_api.is_alive(public_keys[secret], function(is_alive) {
				if (!is_alive) {
					console.log('[radar] Client '+ secret +' is definetly dead, will remove secret');
					remove_array_element(secrets, secret);
					delete public_keys[secret];
				}
			});
		});

		/* Set timeout for next check
		 */
		setTimeout(update_radar, (_configuration['min-radar-interval'] + 10) / _private_ship_keys.length);
	};



	/**
	 * @return Most current information about public_key or undefined if
	 *     does not exist
	 */
	this.ship = function(public_key) {
		if (!_radar.ships.hasOwnProperty(public_key)) {
			return null;
		}
		return _radar.ships[public_key];
	};

	this.shot = function(public_key) {
		if (!_radar.shots.hasOwnProperty(public_key)) {
			return null;
		}
		return _radar.shots[public_key];
	};

//	/**
//	 * @return All clients
//	 */
//	this.clients = function() {
//		return radar.client;
//	};

	/**
	 * Adds new private ship key
	 */
	this.add = function(public_key, private_key) {
		public_keys[private_key] = public_key;
		_private_ship_keys.push(private_key);

		if (1 === _private_ship_keys.length) {
			update_radar();
		}
	};

};
















