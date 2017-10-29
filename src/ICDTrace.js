import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Box from 'grommet/components/Box'
import Table from 'grommet/components/Table'
import TableHeader from 'grommet/components/TableHeader'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button'
import Form from 'grommet/components/Form'
import TextInput from 'grommet/components/TextInput'

import './grommet-css'
import './styles/icdtrace.css'
import registerServiceWorker from './registerServiceWorker'


class ICDTrace extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.selectResult = this.selectResult.bind(this)

    this.state = {
      diagnosis: '', 
      results: {"in_text": "", "result": [[]]},
			request_sent: false,
			result_obtained: false,
			rotate: 0,
      selected: 0
    }
  }

  handleChange(event) {
    this.setState({diagnosis: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    let pipeline_id = '72251338-4430-42bc-9796-414138537a17'
    let diagnosis = encodeURIComponent(this.state.diagnosis.trim())
    let session_url = 'http://173.197.138.162:8080/v1/pipeline/' + pipeline_id
    console.log(session_url)

    // if request_sent && !result_obtained, show "loading" icon
    this.setState({result_obtained: false})

    let xhr = new XMLHttpRequest()
    xhr.onerror = () => {
      console.log("onerror")
			// this.setState({result_obtained: true})
      // this.setState({results: jsonResults[this.state.rotate]})
      // if (this.state.rotate < 2) {
      //   this.setState({rotate: this.state.rotate + 1})
      // } else {
      //   this.setState({rotate: 0})
      // }
    }
		xhr.onreadystatechange = () => {
			switch (this.readyState) {
				case 0: console.log("unsent")
          console.log("0")
          break
				case 1: console.log("opened")
          console.log("1")
          break
				case 2: console.log("headers_received")
          console.log("2")
          break
				case 3: console.log("loading")
          console.log("3")
          break
				case 4: console.log("done")
          console.log("4")
          this.setState({result_obtained: true})
          break
				case undefined:
          console.log("undef")
          // xhr issues --> undefined readystate simulates "sent" req
					// this.setState({request_sent: true})
          break
				default: break
			}
		}
    xhr.open("PUT", session_url)
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.response)
          console.log(xhr.responseXML)
          this.setState({results: xhr.response})
        }
      }
    }
    const body = [{'description': diagnosis}]
    xhr.send(JSON.stringify(body))
  }

  selectResult(event) {
    var t = event.currentTarget
    this.setState({selected: t.id})
    // setTimeout because setState calls are batched for performance 
    // should really use componentDidUpdate
    setTimeout(() => {
      this.trimResults(this.state.selected)
    }, 1);
  }

  trimResults(selected) {
    let results = this.state.results
    console.log(results)
    results.result.forEach((r) => {
      if (r[1] == selected) {
        this.setState({results: {result: [r]}})
      }
    })
  }

  render() {
    return (
      <Box align="center" direction="column">
        <h2 className="app-title">
          ICDTrace
        </h2>
        <Box margin={{vertical: "small"}}>
          <Form onSubmit={this.handleSubmit} className="diagnosis-form">
            <h2>
              Enter Diagnosis:
            </h2>
            <TextInput className="diagnosis-text" placeHolder="Diagnosis" onDOMChange={this.handleChange} />
            <br />
            <Button type="submit" primary={true} label="Get ICD Codes"
      className="diagnosis-button" />
            <br />
            {this.state.request_sent && !this.state.result_obtained &&
              <i className="fa fa-spinner fa-pulse fa-fw loading"></i>
            }
          </Form>
        </Box>
				{this.state.result_obtained &&
					<Box className="results" margin={{vertical:"medium"}} size={{width: {max: "large"}}}>
						<Table>
							<TableHeader labels={['Result', 'Code', 'Description']} />
							<tbody>
								{this.state.results.result.map((result, i) => {
                  if (this.state.selected == result[1]) {
                    return (
                      <Result conf=" _conf" selectResult={this.selectResult} 
                      r={result} index={i} />
                    )
                  } else {
                    return (
                      <Result selectResult={this.selectResult} 
                      r={result} index={i} />
                    )
                  }
								})}
							</tbody>
						</Table>
					</Box>
				}
      </Box>
    )
  }
}


class Result extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: 0
    }
  }

  render() {
    return (
      <TableRow className={"results"+this.props.conf} onClick={this.props.selectResult}
      id={this.props.r[1]} key={this.props.r[1]}>
        <td>{this.props.index + 1}</td>
        <td>{this.props.r[2]}</td>
        <td>{this.props.r[3]}</td>
      </TableRow>
    );
  }
}

export default ICDTrace
