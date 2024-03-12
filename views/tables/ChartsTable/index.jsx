import React from 'react'
import { Typography, Avatar, Checkbox } from '@mui/material'
import {
  Star,
  StarBorder,
  ContentCopy,
  Edit,
  Delete,
  Share,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

import { routes } from '../../routes/routes'
import Table from '../Table'
import TableMenu from '../Table/TableMenu'
import { ChartModel, UrlModel } from '../../models/'
import { SORT_DIRECTION, DATE_FORMAT } from '../../../constants'

import './ChartsTable.css'

const ChartsTable = ({
  charts,
  maxRows,
  onDelete,
  onDuplicate,
  onFavorite,
  onShare,
  onSort,
  sortable,
  sortDirection,
  sortProperty,
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
      dataProperty: 'star',
      label: '',
      sortable: false,
    },
    {
      dataProperty: 'info',
      dataAlign: 'right',
      label: '',
      sortable: false,
    },
  ]
  const handleRequestSort = (_event, property) => {
    const isAsc =
      sortProperty === property && sortDirection === SORT_DIRECTION.ASC

    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }
  const cellRenderer = (chart, property) => {
    switch (property) {
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
      case 'owner':
        return (
          <div className="ChartsTable_Profile">
            <Typography sx={{ pl: '5px' }}>
              {chart['chartOwner'].display_name}
            </Typography>
          </div>
        )
      case 'star':
        return (
          <Checkbox
            name={chart._id}
            disableRipple={true}
            icon={<StarBorder sx={{ color: 'primary.dark' }} />}
            checked={chart.favorite}
            checkedIcon={<Star sx={{ color: 'primary.dark' }} />}
            onChange={() => onFavorite(chart)}
            sx={{
              border: 1,
              borderRadius: '8px',
              borderColor: 'primary.light',
            }}
          />
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
      default:
        return chart[property]
    }
  }

  return (
    <Table
      cellRenderer={cellRenderer}
      data={charts}
      headers={headers}
      handleRequestSort={handleRequestSort}
      sortDirection={sortDirection}
      sortProperty={sortProperty}
      maxRows={maxRows}
    />
  )
}

export default ChartsTable
