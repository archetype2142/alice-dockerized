import React, { Component }  from "react";
// import FileLineSegments from '../components/scenes/FileLineSegments.js';
// import FileLineSegmentsNew from '../components/scenes/FileLineSegmentsNew.js';
import FileLineSegmentsPoly from '../components/scenes/FileLineSegmentsPoly.js';

class WebSockets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFromServer: 0
    };
  }
  
  ws = new WebSocket('ws://localhost:5080/open')
  
  componentDidMount() {
    this.ws.onopen = (evt) => {
      console.info('connected');

      if (this.props.frequency) {
        console.info("Recieving data every " + this.props.frequency + " second(s)");
        setInterval(() => {
          this.ws.send('retrieve_data');
        }, this.props.frequency * 1000)
      } else {
        console.info("Recieving data on filechange");
      }
    }

    this.ws.onmessage = evt => {
      console.info("message recieved");
      var filedata;
      try {
        filedata = JSON.parse(evt.data);
      } catch(e) {
        filedata = evt.data;
      }

      try {
        this.setState({
          dataFromServer: filedata
        })
      } catch(e) {
        alert(e); 
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected');
    }
  }

  render() {
    return ( 
      <div>
        <FileLineSegmentsPoly json={ this.state.dataFromServer }/>
      </div>
    )
  }
}

export default WebSockets;