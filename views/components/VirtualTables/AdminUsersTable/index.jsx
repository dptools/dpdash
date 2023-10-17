import React from 'react'
import { Column, Table } from 'react-virtualized'
import Settings from '@material-ui/icons/Settings'
import Clear from '@material-ui/icons/Clear'
import LockOpen from '@material-ui/icons/LockOpen'
import moment from 'moment'
import TextInput from '../../../forms/TextInput'
import IconButton from '@material-ui/core/IconButton'
import ControlledCheckbox from '../../../forms/ControlledCheckbox'
import {
  ADMIN_TABLE_COLUMN_NUMBER,
  ADMIN_TABLE_MAX_WIDTH,
  TABLE_ROW_HEIGHT,
  DRAWER_WIDTH,
} from '../../../../constants'
import '../Table.css'

const AdminUsersTable = (props) => {
  return (
    <Table
      headerHeight={TABLE_ROW_HEIGHT}
      headerClassName="TableHeader"
      height={props.height}
      rowClassName={props.rowClassName}
      rowCount={props.rowCount}
      rowGetter={({ index }) => props.users.find((_, i) => i === index)}
      rowHeight={TABLE_ROW_HEIGHT}
      sort={props.sort}
      sortBy={props.sortBy}
      sortDirection={props.sortDirection}
      width={
        props.width < ADMIN_TABLE_MAX_WIDTH
          ? props.width
          : props.width - DRAWER_WIDTH
      }
    >
      <Column
        className="CellStyles"
        label="Username"
        dataKey="uid"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        className="CellStyles"
        dataKey="display_name"
        label="Name"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        className="CellStyles"
        dataKey="mail"
        label="Email"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        cellDataGetter={({ rowData }) => rowData.role.value}
        className="CellStyles"
        dataKey="role"
        label="Role"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        cellRenderer={({ rowIndex }) => (
          <div className="IconStyles">
            <Settings onClick={() => props.onAccess(rowIndex)}></Settings>
          </div>
        )}
        dataKey="access"
        label="Access"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        className="CellStyles"
        cellRenderer={({ cellData, rowIndex, rowData }) =>
          rowData.role.value === 'admin' ? null : (
            <TextInput
              control={props.control}
              name={`users.${rowIndex}.account_expires`}
              type="date"
              value={moment(cellData).format('YYYY-MM-DD')}
              onChange={() => props.onUpdateUser(rowIndex)}
            />
          )
        }
        dataKey="account_expires"
        label="Account Expiration"
        width={props.width / 4}
      />
      <Column
        cellRenderer={({ rowIndex }) => (
          <div className="IconStyles">
            <IconButton
              aria-label="Reset Password"
              onClick={() => props.onResetPassword(rowIndex)}
            >
              <LockOpen />
            </IconButton>
          </div>
        )}
        dataKey="force_reset_pw"
        label="Reset Password"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        className="CellStyles"
        cellRenderer={({ rowIndex, rowData }) =>
          props.user.uid === rowData.uid ? null : (
            <ControlledCheckbox
              name={`users.${rowIndex}.blocked`}
              control={props.control}
              onChange={() => props.onUpdateUser(rowIndex)}
            />
          )
        }
        dataKey="blocked"
        label="Inactive"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
      <Column
        className="CellStyles"
        cellRenderer={(cellData) => {
          return props.user.uid === cellData.rowData.uid ? null : (
            <IconButton
              color="secondary"
              aria-label="Delete a user"
              onClick={() => props.onDeleteUser(cellData.rowIndex)}
            >
              <Clear />
            </IconButton>
          )
        }}
        label="Delete"
        width={props.width / ADMIN_TABLE_COLUMN_NUMBER}
      />
    </Table>
  )
}

export default AdminUsersTable
