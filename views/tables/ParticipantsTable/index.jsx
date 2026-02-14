import React from 'react'

import { Star, StarBorder } from '@mui/icons-material'
import { Checkbox, Typography, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import { Link } from 'react-router-dom'

import { SORT_DIRECTION } from '../../../constants'
import { SITE_NAMES } from '../../../server/utils/siteNames'
import StatusChip from '../../components/StatusChip'
import { routes } from '../../routes/routes'
import Table from '../Table'

dayjs.extend(isYesterday)
dayjs.extend(isToday)

const ParticipantsTable = (props) => {
  const {
    onSort,
    onStar,
    participants,
    sortable,
    sortDirection,
    sortProperty,
    maxRows,
  } = props
  const handleRequestSort = (_event, property) => {
    const isAsc =
      sortProperty === property && sortDirection === SORT_DIRECTION.ASC

    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }
  const headers = [
    {
      dataProperty: 'participant',
      label: 'Participant ID',
      sortable: !!sortable,
    },
    {
      dataProperty: 'study',
      label: 'Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'daysInStudy',
      label: 'Days In Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'synced',
      label: 'Last synced',
      sortable: !!sortable,
    },
    {
      dataProperty: 'Active',
      label: 'Status',
      sortable: !!sortable,
    },
    {
      dataProperty: 'star',
      label: '',
      sortable: false,
    },
  ]
  const cellRenderer = (participant, property) => {
    switch (property) {
      case 'synced': {
        const syncedValue = participant[property]
        const participantSyncedDate = dayjs(syncedValue)

        if (syncedValue && participantSyncedDate.isValid()) {
          const isToday = participantSyncedDate.isToday()
          const isYesterday = participantSyncedDate.isYesterday()
          const isTodayOrYesterday = isToday || isYesterday

          return (
            <Typography
              sx={{
                color: isTodayOrYesterday ? 'green.500' : 'text.primary',
              }}
            >
              {isToday
                ? 'Today'
                : isYesterday
                  ? 'Yesterday'
                  : participantSyncedDate.format('MMM-D-YYYY')}
            </Typography>
          )
        }

        return ''
      }
      case 'participant': {
        const { study } = participant

        return (
          <Typography
            component={Link}
            to={routes.dashboard(study, participant.participant)}
            sx={{ textDecoration: 'none', color: 'text.primary' }}
          >
            {participant[property]}
          </Typography>
        )
      }
      case 'Active': {
        const isActive = participant[property] === 1

        return <StatusChip isActive={isActive} />
      }
      case 'star':
        return (
          <Checkbox
            name={`star-${participant.study}`}
            disableRipple
            icon={<StarBorder sx={{ color: 'primary.dark' }} />}
            checked={participant.star}
            checkedIcon={<Star sx={{ color: 'primary.dark' }} />}
            value={participant.participant}
            onChange={onStar}
            sx={{
              border: 1,
              borderRadius: '8px',
              borderColor: 'primary.light',
            }}
          />
        )
      case 'study': {
        const participantProperty = participant[property]
        const tooltipTitle =
          SITE_NAMES[participantProperty] || participantProperty

        return (
          <Tooltip title={tooltipTitle} placement="right">
            <Typography
              component={Link}
              to={routes.studyDashboard(participant.study)}
              sx={{ textDecoration: 'none', color: 'text.primary' }}
            >
              {participantProperty}
            </Typography>
          </Tooltip>
        )
      }
      default:
        return participant[property]
    }
  }

  return (
    <Table
      cellRenderer={cellRenderer}
      data={participants}
      headers={headers}
      sortDirection={sortDirection}
      sortProperty={sortProperty}
      handleRequestSort={handleRequestSort}
      maxRows={maxRows}
    />
  )
}

export default ParticipantsTable
