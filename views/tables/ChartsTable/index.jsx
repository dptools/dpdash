import React from 'react'
import { Typography } from '@mui/material'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { routes } from '../../routes/routes'
import Table from '../Table'
import TableMenu from './TableMenu'

export const DATE_FORMAT = 'MM/DD/YYYY'
const ChartsTable = ({
  charts,
  sortable,
  onDelete,
  onDuplicate,
  onShare,
  user,
}) => {
  const headers = [
    {
      dataProperty: 'title',
      label: 'Chart',
      sortable: !!sortable,
    },
    {
      dataProperty: 'updatedAt',
      label: 'Date Modified',
      sortable: !!sortable,
    },
    {
      dataProperty: 'owner',
      label: 'Created By',
      sortable: !!sortable,
    },
    {
      dataProperty: 'info',
      dataAlign: 'right',
      label: '',
      sortable: false,
    },
  ]
  const cellRenderer = (chart, property) => {
    switch (property) {
      case 'title':
        const viewChart = routes.viewChart(chart._id)

        return (
          <Link className="Link--unstyled" to={viewChart}>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              {chart[property]}
            </Typography>
          </Link>
        )
      case 'updatedAt':
        return chart[property]
          ? moment(chart[property]).format(DATE_FORMAT)
          : ''
      case 'info':
        return (
          <TableMenu
            chart={chart}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onShare={onShare}
            user={user}
          />
        )
      default:
        return chart[property]
    }
  }

  return <Table cellRenderer={cellRenderer} data={charts} headers={headers} />
}

export default ChartsTable
