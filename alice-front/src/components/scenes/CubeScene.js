import * as THREE from 'three';
import Scene from "../resources/Scene"
import Plane from '../shapes/Plane'
import Cube from '../shapes/Cube'
import SpotLight from '../resources/SpotLight'

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

//position(x, y, z), size(x, y, z), color
var cube = Cube([0, 3, 0], [4, 4, 4], 0xff0000);

//position(x, y, z), color
var spotlight = SpotLight([0, 20, 50], 0xffffff);

//position(x, y, z), size(x, y), rotation(x, y, z), color
var plane = Plane([0, 0, 0], [60, 30], [-0.5 * Math.PI, 0, 0.5 * Math.PI], 0xffffff);

//add components dynamic
var scene = Scene(spotlight, plane, cube);

function animateCube() {
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;
  cube.rotation.z += 0.02;
  requestAnimationFrame(animateCube);
  renderer.render(scene, camera);
}

function CubeScene() {
  renderer.setSize(
    window.innerWidth, 
    window.innerHeight
  );

  renderer.shadowMap.enabled = true;

  camera.position.x = 50; 
  camera.position.y = 50; 
  camera.position.z = 0; 

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  animateCube();

  document.getElementById('root').append(renderer.domElement);
  return ( null );
}

export default CubeScene;