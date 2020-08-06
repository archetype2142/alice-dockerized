import * as THREE from 'three';

function Line(rotation, position, vertices, id, color) {
  const lineMaterial = new THREE.LineBasicMaterial({ 
  	color: color
  });
	  
  var geometry = new THREE.Geometry();

  vertices.forEach(function(element) {
    geometry.vertices.push(new THREE.Vector3(element) );
  });
  
  var line = new THREE.Line(geometry, lineMaterial);

  line.position.x = position[0];
  line.position.y = position[1]; 
  line.position.z = position[2];

  line.rotation.x = rotation[0];
  line.rotation.y = rotation[1]; 
  line.rotation.z = rotation[2];

  line.castShadow = true;
  line.name = id;
  return line;
}

export default Line