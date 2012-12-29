
/**
 * @return Random number between min and max. If max is not given, than it is
 *    set to min and min is set to -min
 */
var random = function(min, max) {
	if ('undefined' === typeof(max)) {
		max = min;
		min = -min;
	}

	return Math.random() * (max - min) + min;
};



/**
 * @return Zufaellige Richtung mit definierter Geschwindigkeit
 */
var random_direction = function(speed) {
	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var len = Math.sqrt(x * x + y * y);

	x = x / len * speed;
	y = y / len * speed;

	return {
		x: x,
		y: y
	};
};





module.exports = {
	random: random,
	random_direction: random_direction
};

