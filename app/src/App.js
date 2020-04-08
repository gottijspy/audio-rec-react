import React, { Component } from "react";
import "./App.css";
import Record from "./record/Record";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Card">
          <Record />
        </div>
      </div>
    );
  }
}

export default App;
