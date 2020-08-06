import * as THREE from 'three';

function Cube(position, size, color) {
	const cubeGeometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const cubeMaterial = new THREE.MeshLambertMaterial({ 
  	color: color
  });
	
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  
  cube.position.x = position[0];
  cube.position.y = position[1]; 
  cube.position.z = position[2];
  cube.castShadow = true;

  return cube;
}

export default Cube