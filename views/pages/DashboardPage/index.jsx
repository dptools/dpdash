import React from 'react'
import { Box } from '@mui/material'

import ParticipantsTable from '../../tables/ParticipantsTable'
import PageHeader from '../../components/PageHeader'
import useParticipantsList from '../../hooks/useParticipantsList'

const DashboardPage = () => {
  const {
    participants,
    onSort,
    onStar,
    sortBy,
    sortDirection,
  } = useParticipantsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Dashboard"
      />

      <ParticipantsTable
        participants={participants}
        onStar={onStar}
        onSort={onSort}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        sortable
        maxRows={5}
      />
    </Box>
  )
}

export default DashboardPage
