import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { spring, AnimatedSwitch } from 'react-router-transition'
import ICDTrace from './ICDTrace.js'
import CKDRisk from './CKDRisk.js'


class DashRow extends Component {

  render() {
    return (
      <div className="dash-row">
          <Link to={this.props.link1[0]} className="dash-item">
            {this.props.link1[1]}            
          </Link>
          <Link to={this.props.link2[0]} className="dash-item">
            {this.props.link2[1]}
          </Link>
      </div>
    )
  }
}

class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        <h2 className="app-title">Dashboard</h2>
        <DashRow 
          link1={['/icdtrace','ICDTrace']} 
          link2={['/ckdrisk','CKD Risk']} />
        <DashRow
          link1={['/loinc','LOINC']}
          link2={['/drugtag','Drug Name Tagging']} />
        <DashRow
          link1={['/pophealth','Population Health Mgmt.']}
          link2={['/340b','340B Drug Pricing']} />
      </div>
    )
  }
}

const LOINC = () => (
  <div>
    <h2 className="app-title">LOINC</h2>
  </div>
)

const DrugTag = () => (
  <div>
    <h2 className="app-title">Drug Name Tagging</h2>
  </div>
)

const PopHealth = () => (
  <div>
    <h2 className="app-title">Population Health Management</h2>
  </div>
)

const DrugPrice = () => (
  <div>
    <h2 className="app-title">340B Drug Pricing</h2>
  </div>
)

function mapStyles(styles) {
  return {
      opacity: styles.opacity,
      transform: `translateX(${styles.offset}px)`,
    };
}

function glide(val) {
  return spring(val, {
      stiffness: 127,
      damping: 17,
    });
}

const pageTransitions = {
  atEnter: {
      offset: -50,
      opacity: 0,
    },
  atLeave: {
      offset: glide(-50),
      opacity: glide(0),
    },
  atActive: {
      offset: glide(0),
      opacity: glide(1),
    },
}

const App = () => (
  <Router>
      <div className="App">
			<div className="Header">
				<Link to="/">
          MedTRACE Solutions
				</Link>
			</div>

      <hr/>

      <AnimatedSwitch
          {...pageTransitions}
          mapStyles={mapStyles}
          className="switch-wrapper">
        <Route exact path="/" component={Dashboard}/>
        <Route path="/icdtrace" component={ICDTrace}/>
        <Route path="/ckdrisk" component={CKDRisk}/>
        <Route path="/loinc" component={LOINC}/>
        <Route path="/drugtag" component={DrugTag}/>
        <Route path="/pophealth" component={PopHealth}/>
        <Route path="/340b" component={DrugPrice}/>
      </AnimatedSwitch>
    </div>
  </Router>
)

export default App 
