import React, { Component } from 'react';
// import CubeScene from './components/scenes/CubeScene.js';
// import SphereScene from './components/scenes/SphereScene.js';
// import ImportGlb from './components/scenes/ImportGlb.js'
// import ApiLineSegment from './components/scenes/ApiLineSegments.js'
// import Sandbox  from "./components/sandbox.js";
// import styled from "styled-components";
// import ThreeScene from './components/scenes/ThreeScene.js';
import WebSocket from './components/websocket.js'


class App extends Component { 
	render() {
		return (
      <div>
        <WebSocket/>  
      </div>
		)
	}
}

export default App;
