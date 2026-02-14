import React from 'react'

import { Box, Typography } from '@mui/material'

import PageHeader from '../components/PageHeader'
import ParticipantsSearchForm from '../forms/ParticipantsSearchForm'
import useParticipantsList from '../hooks/useParticipantsList'
import ParticipantsTable from '../tables/ParticipantsTable'

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
