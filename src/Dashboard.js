import React, { Component } from 'react';

class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.handleSelection = this.handleSelection.bind(this);
  }

	handleSelection(e) {
    console.log('in handleSelection')
    this.props.onNavigation(e.currentTarget.innerText)
	}

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          <button onClick={this.handleSelection}>ICDTrace</button>
          <button onClick={this.handleSelection}>CKD</button>
        </p>
        <p className="App-intro">
          <button onClick={this.handleSelection}>3</button>
          <button onClick={this.handleSelection}>4</button>
        </p>
        <p className="App-intro">
          <button onClick={this.handleSelection}>5</button>
          <button onClick={this.handleSelection}>6</button>
        </p>
      </div>
    );
  }
}

export default Dashboard;

