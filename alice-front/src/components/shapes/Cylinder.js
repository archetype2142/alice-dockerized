import * as THREE from 'three';

// position: [x, y, z]
// size: [height, thickness, radius]
function Cylinder(position, size, color) {
  var arcShape = new THREE.Shape(); 
  arcShape.absarc( 0, 0, size[1], 0, Math.PI * 2, false ); 
  var holePath = new THREE.Path(); 
  holePath.absarc( 0, 0, 1, 0, Math.PI * 2, true );
  arcShape.holes.push( holePath );

  var extrudeGeom = new THREE.ExtrudeBufferGeometry(arcShape, {
    depth: size[0], 
    curveSegments: 100, 
    bevelEnabled: false
  });
  extrudeGeom.translate(0, 0, -3);
  extrudeGeom.rotateX(-Math.PI * 0.5);

  var cylinder = new THREE.Mesh(
    extrudeGeom, 
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true
    })
  );

  return cylinder;
}

export default Cylinder;