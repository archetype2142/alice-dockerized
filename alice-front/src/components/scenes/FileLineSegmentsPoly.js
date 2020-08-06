import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Scene from "../resources/Scene";
import Poly from "../shapes/Poly";
import SpotLight from '../resources/SpotLight';
import React, { Component } from 'react';
import '../../styles/scenes/ApiLineSegments.css';
import * as dat from 'dat.gui';

const gui = new dat.GUI();
var charge_pos_group = new THREE.Group();
charge_pos_group.name = "positive";
var charge_neg_group = new THREE.Group();
charge_neg_group.name = "negative";
var charge_net_group = new THREE.Group();
charge_net_group.name = "neutral";

var light = gui.addFolder('Light');
// var core = gui.addFolder('Core');
light.open();
// core.open();

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  10000
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

var addSegment = function(tracks) {
  if(tracks.length > 0) {
    tracks.forEach(function(element, index) {
      if(element.fCharge === 0) {
        charge_net_group.add(
          Poly(element, "neutral")
        )
      } else if (element.fCharge === -1) {
        charge_neg_group.add(
          Poly(element, "negative")
        )
      } else {
        charge_pos_group.add(
          Poly(element, "positive")
        )
      }
    });
  }

  renderer.render(scene, camera);
  document.getElementById('root').append(renderer.domElement)
  return ( null );
}

var colored = [];

class FileLineSegmentsPoly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      touched: false,
      touched_original_color: '',
      charge_pos_group_visible: true,
      charge_neg_group_visible: true,
      charge_net_group_visible: true,
      first_render: true
    }

    this.handleChangeRequest = this.handleChangeRequest.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);
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

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      tracks: nextProps.json
    };
  }

  init() {
    renderer.setPixelRatio( window.devicePixelRatio );
    sphereInter.visible = false;
    scene.add(sphereInter);
    scene.add(charge_pos_group);
    scene.add(charge_neg_group);
    scene.add(charge_net_group);

    // scene.add(cylinder);
    raycaster.params.Line.threshold = 1;
    renderer.setSize(
      window.innerWidth, 
      window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    camera.position.x = 350; 
    camera.position.y = 350; 
    camera.position.z = 350; 
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
      charge_net_group.children, false 
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
    if(this.state.tracks.fTracks) {
      charge_pos_group.children = [];
      charge_neg_group.children = [];
      charge_net_group.children = [];
      
      addSegment(
        this.state.tracks.fTracks
      );
    }
  }  

  updateVisibility(e) {
    e.preventDefault();

    if(e.target.id === "positive") {
      this.setState({charge_pos_group_visible: !this.state.charge_pos_group_visible});
    } else if(e.target.id === "negative") {
      this.setState({charge_neg_group_visible: !this.state.charge_neg_group_visible});
    } else {
      this.setState({charge_net_group_visible: !this.state.charge_net_group_visible});
    }
  }
  
  render() {
    charge_pos_group.visible = this.state.charge_pos_group_visible;
    charge_neg_group.visible = this.state.charge_neg_group_visible;
    charge_net_group.visible = this.state.charge_net_group_visible;

    var track_count = 0
    if(this.props.json.fTracks) {
      track_count = this.props.json.fTracks.length;
    }
    
    return(
      <div>
        {this.handleChangeRequest()}

        <div style={{'zIndex': 265, position: 'absolute', left: 10, color: 'white'}}> 
          <div className="box">
            <h1>Total Track count: <span>{track_count}</span></h1>
            <h2> Charged particles </h2>
            <h3> 
              Postive: 
              <span>{charge_pos_group.children.length}</span>
              <span id="positive" onClick={this.updateVisibility} className="positive-box"></span>
            </h3>
            <h3> 
              Negative: 
              <span>{charge_neg_group.children.length}</span>
              <span id="negative" onClick={this.updateVisibility} className="negative-box"></span>
            </h3>
            <h3> 
              Neutral: 
              <span>{charge_net_group.children.length}</span>
              <span id="neutral" onClick={this.updateVisibility} className="neutral-box"></span>
            </h3>
          </div>
          <iframe title="rootjs" src="https://root.cern/js/latest/?nobrowser&json=../files/geom/simple_alice.json.gz" />
          <div id="tooltip">
          </div>
        </div>
      </div>
    )
  }
}

export default FileLineSegmentsPoly;
