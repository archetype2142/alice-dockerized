import * as THREE from 'three';
import Scene from "../resources/Scene"
import Plane from '../shapes/Plane'
import Sphere from '../shapes/Sphere'
import SpotLight from '../resources/SpotLight'

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

//radius, wseg, hseg, position(x, y, z), color
var sphere = Sphere([4, 20, 20], [0, 3, 0], 0xff0000);

//position(x, y, z), color
var spotlight = SpotLight([0, 50, 50], 0xffffff);

//position(x, y, z), size(x, y), rotation(x, y, z), color
var plane = Plane([0, 0, 0], [60, 30], [-0.5 * Math.PI, 0, 0.5 * Math.PI], 0xffffff);

//add components dynamic
var scene = Scene(spotlight, plane, sphere);

var step = 0; 
function animateSphere() {
  step += 0.03;
  sphere.position.z = 2 + (20 * (Math.cos(step)));
  sphere.position.y = 5 + (15 * Math.abs(Math.sin(step))); 
  sphere.rotation.x += 0.02;
  requestAnimationFrame(animateSphere);
  renderer.render(scene, camera);
}

function SphereScene() {
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
  animateSphere();

  document.getElementById('root').append(renderer.domElement);
  console.log(renderer.domElement);
  return ( renderer.domElement );
}

export default SphereScene;