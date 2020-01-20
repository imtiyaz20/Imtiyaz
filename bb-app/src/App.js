import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UploadImage from './components/bb-upload-image';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            
              <div className="card-header">
               BERRY BYTES'S Image recognization coordinates.
              </div>
              <div className="card-body">
                <UploadImage />
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;