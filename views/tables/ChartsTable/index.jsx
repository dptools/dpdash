import React from 'react'
import { Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { routes } from '../../routes/routes'
import Table from '../Table'
import TableMenu from '../Table/TableMenu'
import ChartModel from '../../models/ChartModel'

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
        const chartOwnedByUser = ChartModel.isOwnedByUser(chart, user)

        return (
          <TableMenu
            id={chart._id}
            menuItems={[
              {
                Icon: EditIcon,
                component: Link,
                testID: 'edit',
                disabled: !chartOwnedByUser,
                to: routes.editChart(chart._id),
                text: 'Edit',
              },
              {
                Icon: DeleteIcon,
                onClick: () => onDelete(chart),
                disabled: !chartOwnedByUser,
                text: 'Delete',
              },
              {
                Icon: ContentCopyIcon,
                onClick: () => onDuplicate(chart),
                text: 'Duplicate',
              },
              {
                Icon: ShareIcon,
                onClick: () => onShare(chart),
                text: 'Share',
              },
            ]}
          />
        )
      default:
        return chart[property]
    }
  }

  return <Table cellRenderer={cellRenderer} data={charts} headers={headers} />
}

export default ChartsTable
