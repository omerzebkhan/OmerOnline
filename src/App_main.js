import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navigation from './components/Navigation/navigation';


class App extends Component {
  render() {
    return (  
      <div className="appBackground">
      <Navigation />   
      </div>
     
      
    );
  }
}

export default App;