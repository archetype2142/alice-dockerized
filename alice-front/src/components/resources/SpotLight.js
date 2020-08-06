import * as THREE from 'three';

function SpotLight(position, color) {
	var spotLight = new THREE.SpotLight(color); 
    spotLight.position.set(position[0], position[1], position[2]); 
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024; 

    return spotLight;
}

export default SpotLight