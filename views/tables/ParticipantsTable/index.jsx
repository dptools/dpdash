import React from 'react'
import { Checkbox } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'

import Table from '../Table'
import { SORT_DIRECTION } from '../../../constants'

const ParticipantsTable = (props) => {
  const {
    onSort,
    onStar,
    participants,
    sortable,
    sortDirection,
    sortProperty,
  } = props
  const handleRequestSort = (_event, property) => {
    const isAsc =
      sortProperty === property && sortDirection === SORT_DIRECTION.ASC

    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }
  const headers = [
    {
      dataProperty: 'subject',
      label: 'Participant ID',
      sortable: !!sortable,
    },
    {
      dataProperty: 'study',
      label: 'Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'days',
      label: 'Days In Study',
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
      case 'star':
        return (
          <Checkbox
            name={`star-${participant.study}`}
            disableRipple={true}
            icon={<StarBorder sx={{ color: 'primary.dark' }} />}
            checked={participant.star}
            checkedIcon={<Star sx={{ color: 'primary.dark' }} />}
            value={participant.subject}
            onChange={onStar}
            sx={{
              border: 1,
              borderRadius: '8px',
              borderColor: 'primary.light',
            }}
          />
        )

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
    />
  )
}

export default ParticipantsTable
