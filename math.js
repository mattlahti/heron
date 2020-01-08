const PI = Math.PI;
const TWO_PI = PI * 2;
const PI_OVER_180 = PI / 180;

function degrees_to_radians(degrees) {
    return degrees * PI_OVER_180;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}