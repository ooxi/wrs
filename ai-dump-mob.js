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
var radar = require('./radar.js');
var ship = require('./ship.js');



/**
 * A dump mob picking a victim and blindly shooting at it
 *
 * @param _ships Array of ships which can be used by this mob
 * @param _victim_id Id of enemy to attack
 * @param _cb Callback which will be called as soon as victim is killed
 */
module.exports = function(_ships, _victim_id, _cb) {

	/**
	 * true iff victim is dead
	 */
	var _victim_is_dead = false;





	/**
	 * Tries to kill the vicitim with all ships
	 */
	this.move = function() {

		/* Vicitim is already dead, nothing to do
		 */
		if (_vicitim_is_dead) {
			return;
		}
		var victim = radar.client(_vicitim_id);

		/* Victim recently died
		 */
		if (null === victim) {
			_victim_is_dead = true;
			_cb();
			return;
		}
	};
	




	/* Initialize ai
	 */
	(function() {
	})();

};





