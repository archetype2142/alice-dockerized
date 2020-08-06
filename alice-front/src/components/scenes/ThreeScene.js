import React from 'react';
import * as THREE from 'three';

class ThreeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planeGeometry: new THREE.PlaneGeometry(60, 20),
      planeMaterial: new THREE.MeshLambertMaterial({
        color: 0xffffff
      }),
      cubeGeometry: new THREE.BoxGeometry(4, 4, 4),
      cubeMaterial: new THREE.MeshLambertMaterial({ 
        color: 0xff0000
      }),
      sphereGeometry: new THREE.SphereGeometry(4, 20, 20),
      sphereMaterial: new THREE.MeshLambertMaterial({
        color: 0x7777ff
      })
    }
  }

  render() {
    // set size of the window
    // TODO: dynamic change of size
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      window.innerWidth, 
      window.innerHeight
    );
    renderer.shadowMap.enabled = true;
   
    var scene = new THREE.Scene();
    
    // plane motion
    var plane = new THREE.Mesh(this.state.planeGeometry, this.state.planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    // cube motion
    var cube = new THREE.Mesh(this.state.cubeGeometry, this.state.cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 4.02; 
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    // sphere motion
    var sphere = new THREE.Mesh(this.state.sphereGeometry, this.state.sphereMaterial);
    sphere.position.x = 20; 
    sphere.position.y = 4; 
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);

    // light sources
    var spotLight = new THREE.PointLight( 0xffffff ); 
    spotLight.position.set( -40, 40, -15 ); 
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024; 
    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // camera positioning
    var camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.x = -30; 
    camera.position.y = 40; 
    camera.position.z = 30; 
    camera.lookAt(scene.position);

    // animation frames
    function animateCube() {
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
      cube.rotation.z += 0.02;
      requestAnimationFrame(animateCube);
      renderer.render(scene, camera);
    }
    animateCube();

    var step = 0; 
    function bounceSphere() {
      step += 0.05;
      sphere.position.x = 25 + (10 * (Math.cos(step)));
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step))); 
      requestAnimationFrame(bounceSphere);
      renderer.render(scene, camera);
    }
    bounceSphere();

    renderer.render(scene, camera);
    document.getElementById('root').append(renderer.domElement);
    return null;
  }
}

export default ThreeScene;