import React, { Component } from 'react'

import * as _ from 'lodash'
import { connect } from 'react-redux'
import { Column, Table } from 'react-virtualized'

import 'whatwg-fetch'

import basePathConfig from '../server/configs/basePathConfig'

const basePath = basePathConfig || ''

class DeepDive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      subject: '',
      study: '',
      day: 0,
      width: 0,
      height: 0,
      sortBy: '',
      sortDirection: 'ASC',
      marginHeight: 15,
      marginWidth: 5,
    }
  }
  fetchData = (study, subject, day) => {
    return fetch(
      `${basePath}/api/v1/studies/${study}/subjects/${subject}/deepdive/${day}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      }
    )
      .then((response) => {
        if (response.status !== 201) {
          return
        }
        return response.json()
      })
      .then((response) => {
        this.setState({
          data: response,
        })
      })
  }
  handleResize = () => {
    this.setState((prevState) => ({
      ...prevState,
      width: window.innerWidth - prevState.marginWidth,
      height: window.innerHeight - prevState.marginHeight,
    }))
  }
  sort = ({ sortBy, sortDirection }) => {
    const sortedList = this.sortList({ sortBy, sortDirection })
    this.setState((prevState) => ({
      ...prevState,
      sortBy,
      sortDirection,
      data: sortedList,
    }))
  }
  sortList = ({ sortBy, sortDirection }) => {
    const list = _.map(this.state.data, _.clone)
    return _.orderBy(list, [sortBy], sortDirection.toLowerCase())
  }
  rowClassName = ({ index }) => {
    if (index < 0) {
      return 'headerRow'
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow'
    }
  }
  getRowHeight = () => {
    return 30
  }
  UNSAFE_componentWillMount() {
    this.setState({
      subject: this.props.subject.subject,
      study: this.props.subject.study,
      day: parseInt(this.props.subject.day, 10),
    })
    this.fetchData(
      this.props.subject.study,
      this.props.subject.subject,
      this.props.subject.day
    )
  }
  componentDidMount() {
    this.setState((prevState) => ({
      ...prevState,
      width: window.innerWidth - prevState.marginWidth,
      height: window.innerHeight - prevState.marginHeight,
    }))
    /* Resize listener register */
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  render() {
    return (
      <Table
        width={this.state.width}
        height={this.state.height}
        headerHeight={20}
        headerClassName="headerColumn"
        rowHeight={this.getRowHeight}
        rowCount={this.state.data.length}
        rowGetter={({ index }) => this.state.data[index]}
        rowClassName={this.rowClassName}
        sort={this.sort}
        sortBy={this.state.sortBy}
        sortDirection={this.state.sortDirection}
      >
        <Column
          label="Data Type"
          dataKey="data_type"
          width={this.state.width / 8}
        />
        <Column
          width={this.state.width / 8}
          label="Category"
          dataKey="category"
        />
        <Column
          label="Time of Day"
          dataKey="timeofday"
          width={this.state.width / 8}
        />
        <Column
          label="File Name"
          dataKey="file_name"
          width={this.state.width / 8}
        />
        <Column
          label="File Size"
          dataKey="file_size"
          width={this.state.width / 8}
        />
        <Column
          label="Path"
          dataKey="file_path"
          width={(this.state.width / 8) * 3}
        />
      </Table>
    )
  }
}
const mapStateToProps = (state) => ({
  subject: state.subject,
})

export default connect(mapStateToProps)(DeepDive)
