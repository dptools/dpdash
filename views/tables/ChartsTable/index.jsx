import React from 'react'
import { Typography, Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import { ContentCopy, Edit, Delete, Share } from '@mui/icons-material'
import dayjs from 'dayjs'

import { routes } from '../../routes/routes'
import Table from '../Table'
import TableMenu from '../Table/TableMenu'
import { ChartModel, UrlModel } from '../../models/'

import './ChartsTable.css'

export const DATE_FORMAT = 'MM/DD/YYYY'
const ChartsTable = ({
  charts,
  sortable,
  onDelete,
  onDuplicate,
  onShare,
  user,
  maxRows,
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
      case 'owner':
        return (
          <div className="ChartsTable_Profile">
            <Avatar
              alt={chart['chartOwner'].display_name[0]}
              src={UrlModel.sanitizeUrl(
                String(chart['chartOwner'].icon).trim()
              )}
              sx={{ width: 24, height: 24 }}
            />
            <Typography sx={{ pl: '5px' }}>
              {chart['chartOwner'].display_name}
            </Typography>
          </div>
        )
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
        return chart[property] ? dayjs(chart[property]).format(DATE_FORMAT) : ''
      case 'info':
        const chartOwnedByUser = ChartModel.isOwnedByUser(chart, user)

        return (
          <TableMenu
            id={chart._id}
            menuItems={[
              {
                Icon: Edit,
                component: Link,
                testID: 'edit',
                disabled: !chartOwnedByUser,
                to: routes.editChart(chart._id),
                text: 'Edit',
              },
              {
                Icon: Delete,
                onClick: () => onDelete(chart),
                disabled: !chartOwnedByUser,
                text: 'Delete',
              },
              {
                Icon: ContentCopy,
                onClick: () => onDuplicate(chart),
                text: 'Duplicate',
              },
              {
                Icon: Share,
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

  return (
    <Table
      cellRenderer={cellRenderer}
      data={charts}
      headers={headers}
      maxRows={maxRows}
    />
  )
}

export default ChartsTable
