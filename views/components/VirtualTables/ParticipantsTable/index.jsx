import React from 'react'
import { Link } from 'react-router-dom'
import { Column, Table } from 'react-virtualized'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { Checkbox } from '@material-ui/core'
import StarBorder from '@material-ui/icons/StarBorder'
import Star from '@material-ui/icons/Star'
import { routes } from '../../../routes/routes'
import '../Table.css'
import {
  DRAWER_WIDTH,
  ADMIN_TABLE_MAX_WIDTH,
  TABLE_ROW_HEIGHT,
} from '../../../../constants'

const ParticipantsTable = (props) => {
  return (
    <Table
      width={
        props.width < ADMIN_TABLE_MAX_WIDTH
          ? props.width
          : props.width - DRAWER_WIDTH
      }
      height={props.height}
      headerHeight={TABLE_ROW_HEIGHT}
      headerClassName="ParticipantTableHeader"
      rowHeight={TABLE_ROW_HEIGHT}
      rowCount={props.rowCount}
      rowGetter={({ index }) => props.participants.find((_, i) => i === index)}
      rowClassName="ParticipantTableRow"
      sort={props.sort}
      sortBy={props.sortBy}
      sortDirection={props.sortDirection}
    >
      <Column
        label="Participant"
        dataKey="subject"
        width={props.width / 5}
        cellRenderer={({ rowData: { study, subject } }) => {
          return (
            <Link
              style={{ textDecoration: 'none' }}
              to={routes.dashboard(study, subject)}
            >
              {subject}
            </Link>
          )
        }}
      />
      <Column
        label="Study"
        dataKey="study"
        width={props.width / 5}
        cellRenderer={({ rowData }) => {
          return (
            <Link
              style={{ textDecoration: 'none' }}
              to={`/dashboard/${rowData.study}`}
            >
              {rowData.study}
            </Link>
          )
        }}
      />
      <Column
        label="Complete"
        cellRenderer={({ rowData: { study, subject, complete } }) => (
          <Checkbox
            name={`complete-${study}`}
            className={props.classes.home_td}
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={
              <CheckBoxIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
            }
            checked={complete}
            disableRipple={true}
            value={subject}
            onChange={props.onUpdate}
          />
        )}
        width={props.width / 5}
      />
      <Column
        label="Star"
        cellRenderer={({ rowData: { study, subject, star } }) => (
          <Checkbox
            name={`star-${study}`}
            className={props.classes.home_td}
            disableRipple={true}
            icon={<StarBorder />}
            checked={star}
            checkedIcon={<Star style={{ color: '#FFB80A' }} />}
            value={subject}
            onChange={props.onUpdate}
          />
        )}
        width={props.width / 5}
      />
    </Table>
  )
}

export default ParticipantsTable
