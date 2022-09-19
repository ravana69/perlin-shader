/// stats
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );
stats.dom.style.left = "160px";


// scene, renderer, and camera
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -10000, 10000 );
camera.position.z = 100;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var screenshotRenderer = new THREE.WebGLRenderer({antialiasing:true});
screenshotRenderer.setPixelRatio(2);
screenshotRenderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( screenshotRenderer.domElement );


// lights
var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 3, 3, 3 );
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight2.position.set( -3, 10, 5 );
scene.add(directionalLight2);

/////////////////////////////////////////////////////

var SPEED_COMBINED = 0.2;
var speed = 0.2;
var time = Math.random() * 100000;
var shading = 1.0;
var zoom = 1.0;
var shouldCaptureScreenshot = false;
var pause = false;
var evolve = true;
var vignette = 0.3;
var colorMode = "Saturated";

var speedMod = 0.0;
var speedModAccel = 0.0;
var mouseIsDown = false;

var mapRes = new THREE.Vector3(0.9, 3.0, 0.1);

// var mapT1 = new Threshold(0.17, 0.003);
// var mapT2 = new Threshold(0.50, 0.003);
// var mapT3 = new Threshold(0.83, 0.003);

var mapT1 = new Threshold(0.25, 0.003);
var mapT2 = new Threshold(0.50, 0.004);
var mapT3 = new Threshold(0.75, 0.003);
var allThresholds = [mapT1, mapT2, mapT3];

var region1 = new Region();
var region2 = new Region();
var region3 = new Region();
var region4 = new Region();
var allRegions = [region1, region2, region3, region4];

var geometry = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
var material = new THREE.ShaderMaterial( {
    uniforms: {
      time: {type:'f', value:time},
      resolution: { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
      shadowStrength: {type:'f', value: shading},
      vignette: {type:'f', value: vignette},
      mapRes: {type:'v3', value:mapRes},
      mapT1: {type:'f', value:mapT1.value},
      mapT2: {type:'f', value:mapT2.value},
      mapT3: {type:'f', value:mapT3.value},
      region1Res: {type:'v4', value:region1.res},
      region2Res: {type:'v4', value:region2.res},
      region3Res: {type:'v4', value:region3.res},
      region4Res: {type:'v4', value:region4.res},
      region1Thresh: {type:'v2', value:region1.thresh},
      region2Thresh: {type:'v2', value:region2.thresh},
      region3Thresh: {type:'v2', value:region3.thresh},
      region4Thresh: {type:'v2', value:region4.thresh},

      zone1ARes: {type:'v4', value:region1.zones[0].res},
      zone1AColor: {type:'c', value:region1.zones[0].color},
      zone1AOptions: {type:'v4', value:region1.zones[0].options},
      zone1BRes: {type:'v4', value:region1.zones[1].res},
      zone1BColor: {type:'c', value:region1.zones[1].color},
      zone1BOptions: {type:'v4', value:region1.zones[1].options},
      zone1CRes: {type:'v4', value:region1.zones[2].res},
      zone1CColor: {type:'c', value:region1.zones[2].color},
      zone1COptions: {type:'v4', value:region1.zones[2].options},

      zone2ARes: {type:'v4', value:region2.zones[0].res},
      zone2AColor: {type:'c', value:region2.zones[0].color},
      zone2AOptions: {type:'v4', value:region2.zones[0].options},
      zone2BRes: {type:'v4', value:region2.zones[1].res},
      zone2BColor: {type:'c', value:region2.zones[1].color},
      zone2BOptions: {type:'v4', value:region2.zones[1].options},
      zone2CRes: {type:'v4', value:region2.zones[2].res},
      zone2CColor: {type:'c', value:region2.zones[2].color},
      zone2COptions: {type:'v4', value:region2.zones[2].options},

      zone3ARes: {type:'v4', value:region3.zones[0].res},
      zone3AColor: {type:'c', value:region3.zones[0].color},
      zone3AOptions: {type:'v4', value:region3.zones[0].options},
      zone3BRes: {type:'v4', value:region3.zones[1].res},
      zone3BColor: {type:'c', value:region3.zones[1].color},
      zone3BOptions: {type:'v4', value:region3.zones[1].options},
      zone3CRes: {type:'v4', value:region3.zones[2].res},
      zone3CColor: {type:'c', value:region3.zones[2].color},
      zone3COptions: {type:'v4', value:region3.zones[2].options},

      zone4ARes: {type:'v4', value:region3.zones[0].res},
      zone4AColor: {type:'c', value:region3.zones[0].color},
      zone4AOptions: {type:'v4', value:region3.zones[0].options},
      zone4BRes: {type:'v4', value:region3.zones[1].res},
      zone4BColor: {type:'c', value:region3.zones[1].color},
      zone4BOptions: {type:'v4', value:region3.zones[1].options},
      zone4CRes: {type:'v4', value:region3.zones[2].res},
      zone4CColor: {type:'c', value:region3.zones[2].color},
      zone4COptions: {type:'v4', value:region3.zones[2].options}

     },
     fragmentShader: document.getElementById( 'fragShader' ).innerHTML,
     side: THREE.DoubleSide
   } );

var plane = new THREE.Mesh(geometry, material);
scene.add(plane);


// gui
var gui = new dat.GUI();
gui.add(this, "speed", 0.0, 1.0);
gui.add(this, "shading", 0.0, 2.0);
gui.add(this, "vignette", 0.0, 2.0);
gui.add(this, "zoom", 0.5, 5.0).listen();
gui.add(this, "evolve");
gui.add(this, "pause").listen();
gui.add(this, "randomize");
gui.add(this, "randomizeColor");
var colorModeControl = gui.add(this, "colorMode", [ 'Saturated', 'Desaturated', 'Monochrome', 'Dark' ]);
gui.add(this, "saveImage");

// var mapResFolder = gui.addFolder('mapRes');
// mapResFolder.open();
// mapResFolder.add(mapRes, "x", 0.5, 3.0);
// mapResFolder.add(mapRes, "y", 0.5, 5.0);
// mapResFolder.add(mapRes, "z", 0.0, 1.0);

gui.close();

colorModeControl.onChange(function(value) {
  randomizeColor();
});

renderer.domElement.onmousedown = function() {
  mouseIsDown = true;
  speedModAccel = 10.0;
}

renderer.domElement.onmouseup = function() {
  mouseIsDown = false;
}

renderer.domElement.addEventListener('touchend', function() {
	speedModAccel = 10.0;
});

function update() {
  updateSpeed();
  if (evolve) { updateThresholds(); }
  updateUniforms();
}

function updateSpeed() {
  // if (mouseIsDown) { speedModAccel = 10.0; }
  speedMod += speedModAccel;
  speedMod *= 0.8;
  speedModAccel *= 0.93;
  if (pause) {
    SPEED_COMBINED = speedMod;
  } else {
    SPEED_COMBINED = speed + speedMod;
  }
  time += SPEED_COMBINED;
}

function saveImage() {
  shouldCaptureScreenshot = true;
}

function randomize() {
  time = Math.random() * 100000;
  for (var i=0; i<allRegions.length; i++) {
    allRegions[i].randomize();
  }

  for (var i=0; i<allThresholds.length; i++) {
    // allThresholds[i].value = (i+1) * 0.25;
    allThresholds[i].randomize();
  }
  sortThresholds();
  update();
}

function randomizeColor() {
  for (var i=0; i<allRegions.length; i++) {
    allRegions[i].randomizeColor();
  }
}

function updateThresholds() {
  // update thresholds
  for (var i=0; i<allThresholds.length; i++) {
    allThresholds[i].update();
  }
  // sort thresholds
  sortThresholds();
  // wrap upper threshold
  if (allThresholds[allThresholds.length-1].value > 1.0) {
    var lastThresh = allThresholds.pop();
    lastThresh.value = 0.0 + (lastThresh.value-1.0);
    allThresholds.unshift(lastThresh);
    // sortThresholds();
    // cycle regions
    var lastRegion = allRegions.pop();
    lastRegion.randomize();
    allRegions.unshift(lastRegion);
  }
}

function sortThresholds() {
  allThresholds.sort(function(a, b) {
    return parseFloat(a.value) - parseFloat(b.value);
  });
}

function updateUniforms() {
  material.uniforms.time.value = time;

  material.uniforms.shadowStrength.value = shading;
  material.uniforms.vignette.value = vignette;

  material.uniforms.mapRes.value = mapRes.clone().multiplyScalar(zoom);

  material.uniforms.mapT1.value = allThresholds[0].value;
  material.uniforms.mapT2.value = allThresholds[1].value;
  material.uniforms.mapT3.value = allThresholds[2].value;

  material.uniforms.region1Res.value = allRegions[0].res.clone().multiplyScalar(zoom);
  material.uniforms.region2Res.value = allRegions[1].res.clone().multiplyScalar(zoom);
  material.uniforms.region3Res.value = allRegions[2].res.clone().multiplyScalar(zoom);
  material.uniforms.region4Res.value = allRegions[3].res.clone().multiplyScalar(zoom);

  material.uniforms.region1Thresh.value = allRegions[0].thresh;
  material.uniforms.region2Thresh.value = allRegions[1].thresh;
  material.uniforms.region3Thresh.value = allRegions[2].thresh;
  material.uniforms.region4Thresh.value = allRegions[3].thresh;

  material.uniforms.zone1ARes.value = allRegions[0].zones[0].res.clone().multiplyScalar(zoom);
  material.uniforms.zone1AColor.value = allRegions[0].zones[0].color;
  material.uniforms.zone1AOptions.value = allRegions[0].zones[0].options;
  material.uniforms.zone1BRes.value = allRegions[0].zones[1].res.clone().multiplyScalar(zoom);
  material.uniforms.zone1BColor.value = allRegions[0].zones[1].color;
  material.uniforms.zone1BOptions.value = allRegions[0].zones[1].options;
  material.uniforms.zone1CRes.value = allRegions[0].zones[2].res.clone().multiplyScalar(zoom);
  material.uniforms.zone1CColor.value = allRegions[0].zones[2].color;
  material.uniforms.zone1COptions.value = allRegions[0].zones[2].options;

  material.uniforms.zone2ARes.value = allRegions[1].zones[0].res.clone().multiplyScalar(zoom);
  material.uniforms.zone2AColor.value = allRegions[1].zones[0].color;
  material.uniforms.zone2AOptions.value = allRegions[1].zones[0].options;
  material.uniforms.zone2BRes.value = allRegions[1].zones[1].res.clone().multiplyScalar(zoom);
  material.uniforms.zone2BColor.value = allRegions[1].zones[1].color;
  material.uniforms.zone2BOptions.value = allRegions[1].zones[1].options;
  material.uniforms.zone2CRes.value = allRegions[1].zones[2].res.clone().multiplyScalar(zoom);
  material.uniforms.zone2CColor.value = allRegions[1].zones[2].color;
  material.uniforms.zone2COptions.value = allRegions[1].zones[2].options;

  material.uniforms.zone3ARes.value = allRegions[2].zones[0].res.clone().multiplyScalar(zoom);
  material.uniforms.zone3AColor.value = allRegions[2].zones[0].color;
  material.uniforms.zone3AOptions.value = allRegions[2].zones[0].options;
  material.uniforms.zone3BRes.value = allRegions[2].zones[1].res.clone().multiplyScalar(zoom);
  material.uniforms.zone3BColor.value = allRegions[2].zones[1].color;
  material.uniforms.zone3BOptions.value = allRegions[2].zones[1].options;
  material.uniforms.zone3CRes.value = allRegions[2].zones[2].res.clone().multiplyScalar(zoom);
  material.uniforms.zone3CColor.value = allRegions[2].zones[2].color;
  material.uniforms.zone3COptions.value = allRegions[2].zones[2].options;

  material.uniforms.zone4ARes.value = allRegions[3].zones[0].res.clone().multiplyScalar(zoom);
  material.uniforms.zone4AColor.value = allRegions[3].zones[0].color;
  material.uniforms.zone4AOptions.value = allRegions[3].zones[0].options;
  material.uniforms.zone4BRes.value = allRegions[3].zones[1].res.clone().multiplyScalar(zoom);
  material.uniforms.zone4BColor.value = allRegions[3].zones[1].color;
  material.uniforms.zone4BOptions.value = allRegions[3].zones[1].options;
  material.uniforms.zone4CRes.value = allRegions[3].zones[2].res.clone().multiplyScalar(zoom);
  material.uniforms.zone4CColor.value = allRegions[3].zones[2].color;
  material.uniforms.zone4COptions.value = allRegions[3].zones[2].options;
}

function takeScreenshot() {
  material.uniforms.resolution.value.x = window.innerWidth*2;
  material.uniforms.resolution.value.y = window.innerHeight*2;
  screenshotRenderer.render(scene, camera);

  var w = window.open('', '');
  w.document.title = "screenshot";
  w.document.body.style.backgroundColor = "black";
  w.document.body.style.margin = "0px";

  var img = new Image();
  img.src = screenshotRenderer.domElement.toDataURL();
  img.width = window.innerWidth;
  img.height = window.innerHeight;
  w.document.body.appendChild(img);

  material.uniforms.resolution.value.x = window.innerWidth;
  material.uniforms.resolution.value.y = window.innerHeight;
}

function render()
{
	stats.begin();
	requestAnimationFrame(render);

  update();

  renderer.render(scene, camera);

  if (shouldCaptureScreenshot == true){
      takeScreenshot();
      shouldCaptureScreenshot = false;
  }

  stats.end();
}
render();

// event listeners

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        pause = !pause;
    }
}

window.addEventListener('mousewheel', function(event) {
  zoom += event.wheelDelta * 0.005;
  if (zoom < 0.5) zoom = 0.5;
  if (zoom > 10.0) zoom = 10.0;
});

window.addEventListener('resize', function()
{
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	material.uniforms.resolution.value.x = WIDTH;
  material.uniforms.resolution.value.y = HEIGHT;
	renderer.setSize(WIDTH, HEIGHT);
  screenshotRenderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
});
