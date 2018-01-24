//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

let step = 0;
// let gui = null;
let dode = null;
let cube = null;
let sphere = null;
let controls = null;

// init renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color("lightgrey"), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
let onRenderFcts = [];

// init scene and camera
const scene = new THREE.Scene();

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

const arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  sourceType: "webcam"

  // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
});

arToolkitSource.init(function onReady() {
  onResize();
});

// handle resize
window.addEventListener("resize", function() {
  onResize();
});
function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////

// create atToolkitContext
const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl:
    THREEx.ArToolkitContext.baseURL + "image/camera_para.dat",
  detectionMode: "mono"
});
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

// update artoolkit on every frame
onRenderFcts.push(function() {
  if (arToolkitSource.ready === false) return;

  arToolkitContext.update(arToolkitSource.domElement);
});

// ;(function(){

//////////////////////////////////////////////////////////////////////////////
//		markerRoot1
//////////////////////////////////////////////////////////////////////////////

// build markerControls
let markerRoot1 = new THREE.Group();
markerRoot1.name = "marker1";
scene.add(markerRoot1);
const dodeMarkerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot1,
  {
    type: "pattern",
    patternUrl: THREEx.ArToolkitContext.baseURL + "image/pattern-letterA.patt"
  }
);

// add a gizmo in the center of the marker
const dodeGeometry = new THREE.DodecahedronGeometry(0.3, 0);
const dodeMaterial = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
dode = new THREE.Mesh(dodeGeometry, dodeMaterial);
markerRoot1.add(dode);

//////////////////////////////////////////////////////////////////////////////
//		markerRoot2
//////////////////////////////////////////////////////////////////////////////

// build markerControls
let markerRoot2 = new THREE.Group();
markerRoot2.name = "marker2";
scene.add(markerRoot2);
const cubeMarkerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot2,
  {
    type: "pattern",
    patternUrl: THREEx.ArToolkitContext.baseURL + "image/pattern-letterB.patt"
  }
);

// add a gizmo in the center of the marker
const cubeGeometry = new THREE.CubeGeometry(0.3, 0.3, 0.3);
const cubeMaterial = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5
  // side: THREE.DoubleSide
});
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.8;
markerRoot2.add(cube);

/////////////////////////////////////////////////////////////////////////////
// marker Root 3
//////////////////////////////////////////////////////////////////////////////
let markerRoot3 = new THREE.Group();
markerRoot3.name = "marker3";
scene.add(markerRoot3);
const sphereMarkerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot3,
  {
    type: "pattern",
    patternUrl: THREEx.ArToolkitContext.baseURL + "image/pattern-letterC.patt"
  }
);

// add a gizmo in the center of the marker
const sphereGeometry = new THREE.SphereGeometry(0.1, 20, 20);
const sphereMaterial = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5
});
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 1;
sphere.position.y = 0.8;
markerRoot3.add(sphere);

// ///////////////////////////////////////////////////////////////////////////
// //wdi sticker
// ///////////////////////////////////////////////////////////////////////////
// // let markerRoot4 = new THREE.Group
// // markerRoot4.name = 'marker4'
// // scene.add( markerRoot4 )
// // const stickerMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot4, {
// //   type : 'pattern',
// //   patternUrl : 'image/pattern-WDI24.patt',
// //   changeMatrixMode: 'cameraTransformMatrix'
// // })
// // scene.visible = false
// //
// // const map = new THREE.TextureLoader().load( "image/subtlejohn.png" );
// // const stickerMaterial = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
// // const stickerSprite = new THREE.Sprite( stickerMaterial );
// // markerRoot4.add( stickerSprite );
//
let markerRoot4 = new THREE.Group();
markerRoot4.name = "marker4";
scene.add(markerRoot4);
var markerControls = new THREEx.ArMarkerControls(
  arToolkitContext,
  markerRoot4,
  {
    type: "pattern",
    patternUrl: THREEx.ArToolkitContext.baseURL + "image/pattern-WDI24.patt"
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    // changeMatrixMode: 'cameraTransformMatrix'
  }
);
//
// // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
// scene.visible = false
//
// //////////////////////////////////////////////////////////////////////////////////
// //		add an object in the scene
// //////////////////////////////////////////////////////////////////////////////////
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////
var map = new THREE.TextureLoader().load(
  THREEx.ArToolkitContext.baseURL + "image/subtlejohn.png"
);
var material = new THREE.SpriteMaterial({
  map: map,
  color: 0xffffff,
  fog: true
});
var stickerSprite = new THREE.Sprite(material);
markerRoot4.add(stickerSprite);

// const sGeo	= new THREE.SphereGeometry(0.1,20,20);
// const sMat	= new THREE.MeshNormalMaterial({
//   transparent: true,
//   opacity: 0.5
// });
// sph	= new THREE.Mesh( sGeo, sMat );
// sph.position.x = 1;
// sph.position.y	= 0.8;
// markerRoot4.add( sph );

////////////////////////////////////////////////////////////////////////////
// class photo
///////////////////////////////////////////////////////////////////////////////

const Controller = new function() {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.02;
}();

const animate = () => {
  step = step + Controller.bouncingSpeed;

  dode.rotation.x += Controller.rotationSpeed;

  cube.position.y = 2 + Math.abs(Math.sin(step));

  cube.rotation.x += Controller.rotationSpeed;
  cube.rotation.y += Controller.rotationSpeed;
  cube.rotation.z += Controller.rotationSpeed;

  sphere.position.x = Math.cos(step) * 0.5;
  sphere.position.y = Math.abs(Math.sin(step));

  // stickerSprite.position.x = 0;
  // stickerSprite.position.x = Math.cos(step) * 0.5;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
};

//

init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  animate();
};

window.onload = init;

// ;(function(){
markerRoot1 = scene.getObjectByName("marker1");
markerRoot2 = scene.getObjectByName("marker2");
markerRoot3 = scene.getObjectByName("marker3");
markerRoot4 = scene.getObjectByName("marker4");

// const container = new THREE.Group
// scene.add(container)

// render the scene
onRenderFcts.push(function() {
  renderer.render(scene, camera);
});

// run the rendering loop
let lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  onRenderFcts.forEach(function(onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
});
