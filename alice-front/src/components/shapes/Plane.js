import * as THREE from 'three';

function Plane(position, size, rotation=[0, 0, 0], color) {
	var planeGeometry = new THREE.PlaneGeometry(size[0], size[1]);
  var planeMaterial = new THREE.MeshLambertMaterial({
      color: color
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	
	plane.rotation.x = rotation[0];
  plane.rotation.y = rotation[1];
  plane.rotation.z = rotation[2];

  plane.position.x = position[0];
  plane.position.y = position[1];
  plane.position.z = position[2];
  
  plane.receiveShadow = true;

  return plane;
}

export default Plane;
