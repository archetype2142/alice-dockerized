import * as THREE from 'three';

function Sphere(segments, position, color) {
	const sphereGeometry = new THREE.SphereGeometry(segments[0], segments[1], segments[2]);
  const sphereMaterial = new THREE.MeshLambertMaterial({ 
  	color: color, wireframe: true
  });
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = position[0];
  sphere.position.y = position[1]; 
  sphere.position.z = position[2];
  sphere.castShadow = true;
  
  return sphere;
}

export default Sphere