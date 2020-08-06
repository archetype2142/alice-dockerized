import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Scene from "../resources/Scene";
import Line from '../shapes/Line';
import Cylinder from '../shapes/Cylinder';
import SpotLight from '../resources/SpotLight';
import React, { Component } from 'react';
import '../../styles/scenes/ApiLineSegments.css';
import * as dat from 'dat.gui';
const gui = new dat.GUI();

var light = gui.addFolder('Light');
var core = gui.addFolder('Core');
light.open();
core.open();


var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

var controls = new OrbitControls( 
  camera, 
  renderer.domElement 
);

//position(x, y, z), color
var spotlight = SpotLight([0, 20, 50], 0xffffff);
light.add(spotlight.position, 'y', -100, 100).listen();

var scene = Scene(spotlight);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var sphereInter = new THREE.Mesh(
  new THREE.SphereBufferGeometry( 5 ),
  new THREE.MeshBasicMaterial( { color: 0xff0000 })
);

var group = new THREE.Group();
var cylinder = new Cylinder([0,0,0], [10, 1.5, 0]);
console.log(cylinder);
core.add(cylinder.material, 'transparent', true, false).listen();
core.add(cylinder.material, 'wireframe', true, false).listen();


var addSegment = function(tracks) {
  console.log(tracks);
  if(tracks.length > 0) {
    tracks.forEach(function(element, index) {
      if(typeof element.dimensions != 'undefined' && typeof element.position != 'undefined' && typeof element.rotations != 'undefined') {
        var line = undefined;
        if(typeof element.properties.color) { 
          var color = element.properties.color 
          line = Line(
            element.rotations,
            element.position, //position, 
            element.dimensions,
            element.id, //vertices, 
            color
          )
        } else {
          line = Line(
            element.rotations,
            element.position, //position, 
            element.dimensions,
            element.id //vertices, 
          )
        }

        group.add(
          line
        )
      }
    });
  }

  renderer.render(scene, camera);
  document.getElementById('root').append(renderer.domElement)
  return ( null );
}

var colored = [];

class FileLineSegmentsNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      touched: false,
      touched_original_color: ''
    }

    this.handleChangeRequest = this.handleChangeRequest.bind(this);
  }

  componentDidMount() {
    this.init();
    this.animate();

    document.addEventListener(
      'mousemove', 
      this.onDocumentMouseMove, 
      false
    );
    window.addEventListener( 
      'resize', 
      this.onWindowResize, 
      false 
    );
  }

  onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  static getDerivedStateFromProps(props, state) {
    return {
      tracks: props.json
    };
  }

  init() {
    renderer.setPixelRatio( window.devicePixelRatio );
    sphereInter.visible = false;
    scene.add(sphereInter);
    scene.add(group);
    scene.add(cylinder);
    raycaster.params.Line.threshold = 1;
    renderer.setSize(
      window.innerWidth, 
      window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    camera.position.x = 50; 
    camera.position.y = 50; 
    camera.position.z = 50; 
    camera.lookAt(scene.position);
    controls.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.onAnimate();
  }

  onAnimate() {
    if(colored.length === 2) {
      colored[0].object.material.color = colored[1];
    }
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( 
      group.children, false 
    );

    if (intersects.length > 0 ) {
      // sphereInter.visible = true;
      // sphereInter.position.copy(intersects[ 0 ].point);
      if (this.state.touched === false) {
        intersects[0].object.material.color = new THREE.Color("rgb(255, 0, 0)");
        // this.setState({
        //   touched: true
        // })
      }
    } else {
      if(this.touched === true) {
        this.setState({
          touched: false
        })
      }
    }

    renderer.render( scene, camera );
  }

  handleChangeRequest() {
    addSegment(
      this.state.tracks
    );
  }
  
  render() {
    var track_count = 0
    if(this.props.json.length) {
      track_count = this.props.json.length;
    }
    return(
      <div>
        { this.handleChangeRequest() } 
        <div style={{'zIndex': 265, position: 'absolute', left: 10, color: 'white'}}> 
          <h1>Track count: <span>{track_count}</span></h1>
          <iframe src="https://root.cern/js/latest/?nobrowser&json=../files/geom/simple_alice.json.gz" />
          <div id="tooltip">
          </div>
        </div>
      </div>
    )
  }
}

export default FileLineSegmentsNew;
