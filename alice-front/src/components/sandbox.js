import React, {Component}  from "react";
import * as THREE from 'three';
import styled from "styled-components";
import Cube from "./shapes/Cube.js";
import SpotLight from './resources/SpotLight'
import Scene from "./resources/Scene.js";
const OrbitControls = require('three-orbitcontrols');

const SceneContainer =  styled.div`
	width :  100%;
	height:  500px;
	background-color:red;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default class Sandbox extends Component {
	constructor() {
		super();
		this.state = {
			
		}
	}

	

	addChildren = () => {
			//this.scene.add(  spotlight,  ambientLight, cube );
			console.log(Scene())
		  
	}
  
	componentDidMount() {
		this.setState({
			container : document.getElementById("container-canvas"),
			width     : window.innerWidth,
			height    : window.innerHeight,
			scene     : new THREE.Scene(),
			camera    : new THREE.PerspectiveCamera(24, window.innerWidth, window.innerHeight, 10, 1000),
			renderer  : new THREE.WebGLRenderer()
		 }, () => {
		});

			var cube = Cube([0, 3, 0], [4, 4, 4], 0xff0000);
			this.container = document.getElementById("container-canvas");
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.scene    = new Scene( cube );
			this.camera   = new THREE.PerspectiveCamera(
											45, 
											window.innerWidth / window.innerHeight, 
											0.1, 
											1000
										);
			var ambientLight = new THREE.AmbientLight(0x0f0f0f);
			
			//var sphere = Cube([4, 20, 20], [4, 4, 4], 0xff0000);
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	    this.controls.target.set(0, 5, 0);
	    this.controls.rotateSpeed = 1.0;
	    this.controls.zoomSpeed = 1.2;
	    this.controls.panSpeed = 0.8;

			var spotlight = SpotLight([5, 10, 5], 0xffffff);
			this.scene.add(spotlight, ambientLight);
			this.camera.position.x = 50; 
		  this.camera.position.y = 50; 
		  this.camera.position.z = 0; 
		  this.camera.lookAt(this.scene.position);
		  //this.addChildren();
		  this.renderer.render( this.scene,  this.camera );
		  this.container.appendChild( this.renderer.domElement );
	}



	render() {
		return ( 
			<SceneContainer id="container-canvas">

			</SceneContainer>
		 )
	}
}