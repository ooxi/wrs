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
	team:	require('./team.js')
};





/**
 * Manages team statistics
 */
module.exports = function(_game) {

	/**
	 * All teams by public key
	 */
	var _teams = {};





	/**
	 * @return true iff one registered team already has that name
	 */
	this.has_name = function(name) {
		if ('string' !== typeof(name)) {
			throw 'Team name must be a string';
		}

		for (var id in _teams) {
			var team = _teams[id];

			if (name === team.name) {
				return true;
			}
		}

		return false;
	};



	/**
	 * Adds a team if name not yet taken
	 */
	this.add = function(name, color) {
		if (this.has_name(name)) {
			throw 'Team name already used';
		}

		var team = new wrs.team(name, color);
		_teams[team.public_key] = team;
		return team;
	};



	/**
	 * @return true iff game with public key does exist
	 */
	this.exists = function(public_key) {
		return _teams.hasOwnProperty(public_key);
	};



	/**
	 * @return Team identified by public key
	 */
	this.get = function(public_key) {
		if (!this.exists(public_key)) {
			throw 'Unknown team identifier';
		}
		return _teams[public_key];
	}
};











