function Region() {

	this.res = new THREE.Vector4();
	this.thresh = new THREE.Vector2(0.33, 0.66);
	this.zones = [new Zone(), new Zone(), new Zone()];

	this.update = function() {

	}

	this.randomize = function() {
		this.res.x = Math.random() * 2.0 + 0.1; // res 1
		this.res.y = Math.random() * 7.0 + 1.0; // res 2
		this.res.z = Math.random() * 0.3; // mix ratio
		this.res.w = Math.random() * 10.0; // seed

		var t1 = 0.2 + Math.random()*0.5;
		var t2 = 0.8 - Math.random()*0.5;

		if (t1 < t2) {
			this.thresh.x = t1;
			this.thresh.y = t2;
		} else {
			this.thresh.x = t2;
			this.thresh.y = t1;
		}

		for (var i=0; i<this.zones.length; i++) {
			this.zones[i].randomize();
		}
	}

	this.randomizeColor = function() {
		for (var i=0; i<this.zones.length; i++) {
			this.zones[i].randomizeColor();
		}
	}

	this.randomize();
}
