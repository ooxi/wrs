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
	var _private_to_public = {};

	/**
	 * Most current radar information
	 */
	var _radar = {
		ships: {},
		shots: {}
	};

	/**
	 * Callbacks wanting to be informed as soon as new information is
	 * available
	 */
	var _listeners = [];



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
		var private_key = _private_ship_keys[_current_private_key];
		_api.radar(private_key, function(echo) {

			/* Extract radar information
			 */
			var new_radar = {
				ships:	{},
				shots:	{}
			};

			for (var i = 0; i < echo['nearby-ships'].length; ++i) {
				var ship = echo['nearby-ships'][i];
				new_radar.ships[ship['public-key']] = ship;
			}
			for (var j = 0; j < echo['nearby-shots'].length; ++j) {
				var shot = echo['nearby-shots'][j];
				new_radar.shots[shot['public-key']] = shot;
			}
			new_radar.ships[echo.me['public-key']] = echo.me;
			_radar = new_radar;

			/* Inform listeners
			 */
			for (var i = 0; i < _listeners.length; ++i) {
				_listeners[i]();
			}

		}, function(exception) {
			console.log('[radar] Failed receiving radar information with '+ private_key +': '+ exception);

			/* Check if client if dead
			 */
			_api.is_alive(_private_to_public[private_key], function(is_alive) {
				if (!is_alive) {
					console.log('[radar] Client '+ private_key +' is definetly dead, will remove private key');
					remove_array_element(_private_ship_keys, private_key);
					delete _private_to_public[private_key];
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
		_private_to_public[private_key] = public_key;
		_private_ship_keys.push(private_key);

		if (1 === _private_ship_keys.length) {
			update_radar();
		}
	};

	/**
	 * Adds a callback function as listener
	 */
	this.listener = function(listener) {
		_listeners.push(listener);
	};

};
















