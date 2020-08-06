import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Scene from "../resources/Scene";
import Line from '../shapes/Line';
import SpotLight from '../resources/SpotLight';
import React, { Component } from 'react';
import '../../styles/scenes/ApiLineSegments.css';

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
var scene = Scene(spotlight);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var sphereInter = new THREE.Mesh(
  new THREE.SphereBufferGeometry( 5 ),
  new THREE.MeshBasicMaterial( { color: 0xff0000 })
);

var group = new THREE.Group();

var addSegment = function(linesegments=[], positions=[], rotations=[]/*, color=[]*/) {
  if(typeof linesegments != 'undefined' && typeof positions != 'undefined' && typeof rotations != 'undefined') {
    if(linesegments.length !== 0) {
      linesegments.forEach(function(element, index) {
        // if(typeof color[index] === 'undefined') { color[index] = 0xffffff; }
        console.log(element);
        group.add(
          Line(
            rotations[index],
            positions[index], //position, 
            element //vertices, 
            // color[index]//color
          )
        )
      });
    }
  }

  renderer.render(scene, camera);
  document.getElementById('root').append(renderer.domElement)
  return ( null );
}

var colored = undefined;

class FileLineSegments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentRotations: [],
      segmentPositions: [],
      lineSegments: [],
      // colors: [],
      api_structure: 'random'
    }

    this.handleChangeRequest = this.handleChangeRequest.bind(this);
    this.appendToState = this.appendToState.bind(this);
  }

  componentDidMount() {
    this.init();
    this.animate();

    addSegment(
      this.state.lineSegments,
      this.state.segmentPositions,
      this.state.segmentRotations
      // this.state.colors
    );
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
      segmentRotations: props.json.rotations,
      segmentPositions: props.json.position,
      lineSegments: props.json.dimensions
      // colors: props.json.colors
    };
  }

  init() {
    renderer.setPixelRatio( window.devicePixelRatio );
    sphereInter.visible = false;
    scene.add(sphereInter);
    scene.add(group);
    raycaster.params.Line.threshold = 3;
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
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( 
      group.children, true 
    );

    if (intersects.length > 0 ) {
      // sphereInter.visible = true;
      // sphereInter.position.copy(intersects[ 0 ].point);
      intersects[0].object.material.color = new THREE.Color("rgb(255, 0, 0)");
      colored = intersects[0];
    } else {
      if(colored) {
        colored.object.material.color = new THREE.Color("rgb(255, 255, 255)");
      }
      // sphereInter.visible = false;
    }
    renderer.render( scene, camera );
  }

  appendToState(rotation, position, segment) {
    this.setState({
      lineSegments: segment,
      segmentRotations: rotation,
      segmentPositions: position
      // colors: colors
    });
  }

  handleChangeRequest() {
    addSegment(
      this.state.lineSegments,
      this.state.segmentPositions,
      this.state.segmentRotations,
      this.state.colors
    );
  }
  
  render() {
    // console.log(colored);
    var track_count = 0
    if(this.props.json.dimensions) {
      track_count = this.props.json.dimensions.length
    }
    return(
      <div>
        { this.handleChangeRequest() } 
        <div style={{'zIndex': 265, position: 'absolute', right: 0, color: 'white'}}> 
          <h1>Track count: <span>{track_count}</span></h1>
          <div id="tooltip">
            addSegment
          </div>
        </div>
      </div>
    )
  }
}

export default FileLineSegments;
