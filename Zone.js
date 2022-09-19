function Zone() {
	this.res = new THREE.Vector4();
	this.color = new THREE.Color();
	this.options = new THREE.Vector4();

	function randomRes() {
		return Math.random() * 0.005 + 0.0005;
	}

	function randColor(color) {

		var r = Math.random();


		if (colorMode == "Saturated") {
			if (r < 0.4) {
				color.setRGB(Math.random(), Math.random(), Math.random());
			} else if (r < 0.8) {
				color.setHSL(Math.random(), Math.random(), Math.random()*0.7);
			} else if (r < 0.9) {
				color.setHSL(Math.random(), 0.0, Math.random());
			} else {
				color.setHSL(Math.random(), 1.0, 0.5);
			}
		}

		if (colorMode == "Desaturated") {
			if (r < 1.0) {
				color.setHSL(Math.random(), Math.random()*0.5, Math.random());
			} else {
				color.setHSL(Math.random(), 1.0, 0.5);
			}
		}

		if (colorMode == "Monochrome") {
			if (r < 1.0) {
				color.setHSL(0.0, 0.0, (Math.random()*0.5) + 0.5);
				// color.setHSL(0.0, 0.0, Math.random());
			} else {
				color.setHSL(Math.random(), 1.0, 0.5);
			}
		}

		if (colorMode == "Dark") {
			if (r < 0.85) {
				color.setHSL(Math.random(), 0.0, Math.random()*0.1);
			} else {
				color.setHSL(Math.random(), 1.0, 0.5);
			}
		}

	}

	this.randomize = function() {
		this.res.x = Math.random() * 2.0 + 0.01; // res 1 - low freq
		this.res.y = Math.random() * 10.0 + 0.1; // res 2 - high freq
		this.res.z = Math.random() * 10.0; // seed 1
		this.res.w = Math.random() * 10.0; // seed 2

		var r = Math.random();

		// render mode
		if (r < 0.2) {
			this.options.x = 1.0; // simple banding
		} else if (r < 0.4) {
			this.options.x = 2.0; // double banding
		} else if (r < 0.6) {
			this.options.x = 3.0; // compound banding
		} else if (r < 0.8) {
			this.options.x = 4.0; // striping
		} else if (r < 1.0) {
			this.options.x = 5.0; // speckles
		}

		// this.options.x = 5.0;


		this.options.y = Math.random() * 20.0; // stripe density
		this.options.z = Math.random(); // random 0-1 value
		this.options.w = Math.random(); // random 0-1 value

		randColor(this.color);
	}

	this.randomizeColor = function() {
		randColor(this.color);
	}



	this.randomize();
}
