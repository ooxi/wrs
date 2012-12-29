
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



/**
 * @return Squared distance between a and b
 */
var distance_sqr = function(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return dx * dx + dy * dy;
};



/**
 * @return Normalized direction from self to target
 */
var look_at = function(self, target) {
	var dx = target.x - self.x;
	var dy = target.y - self.y;
	var len = Math.sqrt(dx * dx + dy * dy);

	return {
		x: dx / len,
		y: dy / len
	};
};



/**
 * @return Point with x and y coordinates
 */
var point = function(x, y) {
	this.x = x;
	this.y = y;
};





module.exports = {
	random: random,
	random_direction: random_direction,
	distance_sqr: distance_sqr,
	look_at: look_at,
	point: point
};

