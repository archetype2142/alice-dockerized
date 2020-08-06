import * as THREE from 'three';

function Scene() {
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf);

	for (var i = 0; i < arguments.length; i++) {
    scene.add(arguments[i]);
  }
  
	return scene;
}

export default Scene;
