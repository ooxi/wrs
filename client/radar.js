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
}





/**
 * By aggregating radar information in one place, we get more data :D
 */
module.exports = function(_api, _configuration) {

	/**
	 * All available api keys
	 */
	var secrets = [];
	var current_secret = -1;

	/**
	 * Mapping from private to public keys
	 */
	var public_keys = {};

	/**
	 * Most current radar information
	 */
	var radar = {
		client: {},
		shot: {}
	};



	/**
	 * Updates world state
	 */
	var update_radar = function() {
		if (0 === secrets.length) {
			console.log('[radar] No secrets available');
			return;
		}

		/* Use next secret
		 */
		++current_secret;
		if (current_secret >= secrets.length) {
			current_secret = 0;
		}

		/* Update radar information
		 */
		var secret = secrets[current_secret];
		_api.radar(secret, function(echo) {
			var new_radar = {
				client: echo['nearby-clients'],
				shot: echo['nearby-shots']
			};
			new_radar.client[echo.me.id] = echo.me;
			radar = new_radar;
		}, function(exception) {
			console.log('Failed receiving radar information with '+ secret +': '+ exception);

			/* Check if client if dead
			 */
			_api.is_alive(public_keys[secret], function(is_alive) {
				if (!is_alive) {
					console.log('Client '+ secret +' is definetly dead, will remove secret');
					remove_array_element(secrets, secret);
					delete public_keys[secret];
				}
			});
		});

		/* Set timeout for next check
		 */
		setTimeout(update_radar, (_configuration['min-radar-interval'] + 10) / secrets.length);
	};



	/**
	 * @return Most current information about client_id or undefined if does
	 *     not exist
	 */
	this.client = function(client_id) {
		if (!radar.client.hasOwnProperty(client_id)) {
			return null;
		}
		return radar.client[client_id];
	};

	this.shot = function(shot_id) {
		if (!radar.shot.hasOwnProperty(shot_id)) {
			return null;
		}
		return radar.shot[shot_id];
	};

	/**
	 * @return All clients
	 */
	this.clients = function() {
		return radar.client;
	};

	/**
	 * Adds new secret
	 */
	this.add = function(public_key, private_key) {
		public_keys[private_key] = public_key;
		secrets.push(private_key);

		if (1 === secrets.length) {
			update_radar();
		}
	};

};
















