function Threshold(value, speed) {
	this.value = value;
	this.speed = speed;

	this.update = function() {
		this.value += this.speed * SPEED_COMBINED;
	}

	this.randomize = function() {
		this.value = Math.random();
		this.speed = Math.random() * 0.003 + 0.001;
	}
}
