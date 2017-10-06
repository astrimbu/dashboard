import React, { Component } from 'react';
import Dashboard from './Dashboard.js';

class App extends Component {

  constructor(props) {
    super(props)

    this.handleNavigation = this.handleNavigation.bind(this)
    this.state = {selectedApp: "Dashboard"}
  }

  handleNavigation(selection) {
    console.log('from: handleNavigation(' + selection + ')')
    this.setState({selectedApp: selection})
  }

  render() {
    let selected = this.state.selectedApp
    let screen = null

    switch (selected) {
      case "Dashboard":
        screen = <Dashboard onNavigation={this.handleNavigation} />
        break
      case "ICDTrace":
        screen = "ICDTrace!"
        break
      default:
        screen = "Other!"
        break
    }

    return (<div>{screen}</div>)
  }
}

export default App;

