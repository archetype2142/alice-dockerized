import * as THREE from 'three';
import Scene from "../resources/Scene"
// import Plane from '../shapes/Plane'
import Line from '../shapes/Line'
import SpotLight from '../resources/SpotLight'
import React, { Component } from 'react';
import '../../styles/scenes/ApiLineSegments.css';

const API = 'http://localhost:3006/structures/';
// const API = 'http://localhost:3000/structures/';

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

//position(x, y, z), color
var spotlight = SpotLight([0, 20, 50], 0xffffff);

// var plane = Plane(
//   [0, 0, 0], //position(x, y, z)
//   [60, 30], //size(x, y)
//   [-0.5 * Math.PI, 0, 0.5 * Math.PI], //rotation(x, y, z)
//   0xffffff //color
// );

var scene = Scene(spotlight);

var animateScene = function() {
  // camera.rotation.x += 0.002;
  scene.rotation.y += 0.002;
  // camera.rotation.z += 0.02;
  requestAnimationFrame(animateScene);
  renderer.render(scene, camera);
}
renderer.setSize(
  window.innerWidth, 
  window.innerHeight
);
renderer.shadowMap.enabled = true;

camera.position.x = 50; 
camera.position.y = 50; 
camera.position.z = 50; 
camera.lookAt(scene.position);
animateScene();

var addSegment = function(linesegments=[], positions=[], rotations=[], color=[]) {
  if(typeof linesegments != 'undefined' && typeof positions != 'undefined' && typeof rotations != 'undefined') {
    if(linesegments.length !== 0) {
      linesegments.forEach(function(element, index) {
        if(typeof color[index] === 'undefined') { color[index] = 0xffffff; }
        scene.add(
          Line(
            rotations[index],
            positions[index], //position, 
            element, //vertices, 
            0,
            color[index]//color
          )
        )
      });
    }
  }
  renderer.render(scene, camera);
  document.getElementById('root').append(renderer.domElement)
  return ( null );
}

class ApiLineSegments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentRotations: [],
      segmentPositions: [],
      lineSegments: [],
      colors: [],
      api_structure: 'random'
    }

    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.handleRotationChange = this.handleRotationChange.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.handleDropDownChange  = this.handleDropDownChange.bind(this);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleRequest = this.handleRequest.bind(this);

    this.appendToState = this.appendToState.bind(this);
  }

  componentDidMount() {
    addSegment()
  }
  
  appendToState(rotation, position, segment, colors) {
    this.setState({
      lineSegments: this.state.lineSegments.concat(segment),
      segmentRotations: this.state.lineSegments.concat(rotation),
      segmentPositions: this.state.lineSegments.concat(position),
      colors: this.state.colors.concat(colors)
    });
  }
  //===========handle form changes==============//
  handleDimensionChange (e) {
    e.preventDefault();
    var dimensions = e.target.value.split(',').map(Number);  
    
    if(dimensions.length === 3) {
      if(dimensions[2] !== '') {
        this.setState({
          lineSegments: [dimensions]
        });
      }
    }
  }

  handleRotationChange (e) {
    e.preventDefault();
    var rotation = e.target.value.split(',').map(Number);   

    if(rotation.length === 3) {
      if(rotation[2] !== '') {
        this.setState({
          segmentRotations: [rotation]
        });
      }
    }
  }

  handlePositionChange (e) {
    e.preventDefault();
    var position = e.target.value.split(',').map(Number);

    if(position.length === 3) {
      if(position[2] > 0) {
        this.setState({
          segmentPositions: [position]
        });
      }
    }
  }

  handleDropDownChange(e) {
    e.preventDefault();
    this.setState({
      api_structure: e.target.value
    })
  }

  //===========handle clicks==============//
  handleClick = (e) => {
    e.preventDefault();

    addSegment(
      this.state.lineSegments,
      this.state.segmentPositions,
      this.state.segmentRotations,
      this.state.colors
    );
  }

  handleRequest = (e) => {
    e.preventDefault();

    fetch(API + this.state.api_structure)
    .then(res => res.json())
    .then(
      (result) => {
        this.appendToState(result.rotations, result.position, result.dimensions, result.colors);
        addSegment(
          this.state.lineSegments,
          this.state.segmentPositions,
          this.state.segmentRotations,
          this.state.colors
        );
        console.log(result);
      }
    );
  }
  
  render() {
    return(
      <div className="row">
        <div className="content">
          <form onClick={ this.handleClick } action="#">
            <input value={this.state.value} onChange={(e) => {this.handleDimensionChange(e)}} placeholder="Dimensions"/>
            <input value={this.state.value} onChange={(e) => {this.handleRotationChange(e)}} placeholder="Rotation"/>
            <input value={this.state.value} onChange={(e) => {this.handlePositionChange(e)}} placeholder="Position"/>
            <button type="submit"> make </button>
          </form>

          <form action="#">
            <select onChange={ this.handleDropDownChange }> 
              <option disabled defaultValue value> -- select an option -- </option>
              <option value="random">random</option>
              <option value="random_color">random_color</option>
              <option value="art">art</option>
              <option value="art_2">art_2</option>
            </select>
            <button type="submit" onClick={ this.handleRequest }>
              Add segment
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default ApiLineSegments;
