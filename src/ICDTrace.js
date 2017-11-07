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
    let pipeline_id = 'e55590bd-043a-4472-bebf-5e9f6dd9daa2'
    let diagnosis = encodeURIComponent(this.state.diagnosis.trim())
    let session_url = 'http://173.197.138.162:8080/v1/pipeline/' + pipeline_id

    // if request_sent && !result_obtained, show "loading" icon
    this.setState({result_obtained: false})

    let xhr = new XMLHttpRequest()
    xhr.open("PUT", session_url)
    xhr.onerror = () => {
      console.log("onerror")
    }
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          // console.log(xhr.response)
          this.setState({
            results: xhr.response,
            result_obtained: true
          })
        }
      }
    }
    const body = [{'description': diagnosis}]
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
    xhr.send(JSON.stringify(body))
    this.setState({request_sent: true})
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
    // TODO: changed Result component
    let results = this.state.results
    console.log(results)
    results.result.forEach((r) => {
      if (r[1] == selected) {
        this.setState({results: {result: [r]}})
      }
    })
  }

  render() {
    var results = []
    if (this.state.result_obtained) {
      let parsed_results = JSON.parse(this.state.results)
      let results_json = parsed_results[0]
      let num_results = results_json.ml_tag.length
      for (var i = 0; i < num_results-1; i++) {
        results.push(
          <Result //selectResult={this.selectResult}
            index={i} code={results_json.ml_tag[i]}
            description={results_json.ml_tag_description[i]}/>
        )
      }
    }
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
                {results}
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
      id={this.props.code} key={this.props.code}>
        <td>{this.props.index + 1}</td>
        <td>{this.props.code}</td>
        <td>{this.props.description}</td>
      </TableRow>
    );
  }
}

export default ICDTrace
