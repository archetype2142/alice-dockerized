import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Scene from "../resources/Scene";
// import OrbitControls from 'three-orbitcontrols';

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
var scene = Scene();

// var loader = new GLTFLoader();
var loader = new GLTFLoader();
loader.load( '../../objects/object.gltf', function ( gltf ) {
  var obj = gltf.scene.children[0];
  obj.scale.set(2, 2, 2);
	// gltf.scene.traverse( function ( child ) {
	// 	if ( child.isMesh ) {
	// 		child.material.envMap = envMap;
	// 	}
	// } );
	scene.add( gltf.scene );
  },
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  // called when loading has errors
  function ( error ) {
    console.log( 'An error happened' );
  }
);

function ImportGlb() {
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
  
	document.getElementById('root').append(renderer.domElement);
	return ( null );
}

export default ImportGlb
