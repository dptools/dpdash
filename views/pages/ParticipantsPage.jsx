import React from 'react'
import { Box, Typography } from '@mui/material'

import ParticipantsTable from '../tables/ParticipantsTable'
import ParticipantsSearchForm from '../forms/ParticipantsSearchForm'
import PageHeader from '../components/PageHeader'
import useParticipantsList from '../hooks/useParticipantsList'

const ParticipantsPage = () => {
  const {
    handleSearch,
    formFilters,
    loading,
    onSort,
    onStar,
    participants,
    searchOptions,
    sortBy,
    sortDirection,
  } = useParticipantsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Participants"
        form={
          <ParticipantsSearchForm
            onSubmit={handleSearch}
            initialValues={{
              participants: formFilters.searchSubjects,
              status: formFilters.status,
              studies: formFilters.studies,
            }}
            allOptions={searchOptions}
          />
        }
      />

      {loading ? (
        <Typography variant="h4">Loading...</Typography>
      ) : (
        <ParticipantsTable
          participants={participants}
          onStar={onStar}
          onSort={onSort}
          sortProperty={sortBy}
          sortDirection={sortDirection}
          sortable
        />
      )}
    </Box>
  )
}

export default ParticipantsPage
