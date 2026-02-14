import React from 'react'

import dayjs from 'dayjs'

import { SITE_NAMES } from '../../../server/utils/siteNames'
import Table from '../Table'

const StudiesTable = (props) => {
  const { onSort, studies, sortable, sortDirection, sortProperty } = props

  const headers = [
    {
      dataProperty: 'study',
      label: 'Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'siteName',
      label: 'Site',
      sortable: !!sortable,
    },
    {
      dataProperty: 'daysInStudy',
      label: 'Days In Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'numOfParticipants',
      label: 'No. of Participants',
      sortable: !!sortable,
    },
    {
      dataProperty: 'updatedAt',
      label: 'Last Updated',
      sortable: !!sortable,
    },
  ]

  const cellRenderer = (study, property) => {
    switch (property) {
      case 'updatedAt': {
        return dayjs(study[property]).toISOString()
      }
      case 'siteName': {
        return SITE_NAMES[study['study']]
      }
      default:
        return study[property]
    }
  }

  return (
    <Table
      cellRenderer={cellRenderer}
      data={studies}
      headers={headers}
      sortDirection={sortDirection}
      sortProperty={sortProperty}
      handleRequestSort={onSort}
    />
  )
}

export default StudiesTable
