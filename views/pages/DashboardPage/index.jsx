import React from 'react'

import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'

import DashboardPageSectionHeader from './DashboardPageSectionHeader'
import PageHeader from '../../components/PageHeader'
import ChartShareForm from '../../forms/ChartShareForm'
import useChartsList from '../../hooks/useChartsList'
import useParticipantsList from '../../hooks/useParticipantsList'
import { routes } from '../../routes/routes'
import ChartsTable from '../../tables/ChartsTable'
import ParticipantsTable from '../../tables/ParticipantsTable'

import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useOutletContext()
  const { participants, onSort, onStar, sortBy, sortDirection } =
    useParticipantsList()
  const {
    charts,
    onDelete,
    onDuplicate,
    onFavorite,
    onShare,
    onSort: onChartSort,
    sortDirection: chartSortDirection,
    sortBy: chartSortBy,
    chartToShare,
    closeDialog,
    shareWithUsers,
    sharedWithOptions,
    shareFormControl,
    shareFormValues,
    clearSelectedUsers,
    selectAllUsers,
  } = useChartsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Dashboard" />
      <section className="DashboardPageSection">
        <DashboardPageSectionHeader
          title="Participants"
          to={routes.participants}
        />
        <ParticipantsTable
          maxRows={5}
          onStar={onStar}
          onSort={onSort}
          participants={participants}
          sortProperty={sortBy}
          sortDirection={sortDirection}
          sortable
        />
      </section>
      <section className="DashboardPageSection">
        <DashboardPageSectionHeader to={routes.charts} title="Charts" />
        <ChartsTable
          charts={charts}
          maxRows={3}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onFavorite={onFavorite}
          onShare={onShare}
          onSort={onChartSort}
          sortProperty={chartSortBy}
          sortDirection={chartSortDirection}
          sortable
          user={user}
        />
      </section>
      <ChartShareForm
        chartToShare={chartToShare}
        closeDialog={closeDialog}
        shareWithUsers={shareWithUsers}
        sharedWithOptions={sharedWithOptions}
        shareFormControl={shareFormControl}
        shareFormValues={shareFormValues}
        clearSelectedUsers={clearSelectedUsers}
        selectAllUsers={selectAllUsers}
      />
    </Box>
  )
}

export default DashboardPage
