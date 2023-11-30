import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Box } from '@mui/material'

import ParticipantsTable from '../../tables/ParticipantsTable'
import PageHeader from '../../components/PageHeader'
import useParticipantsList from '../../hooks/useParticipantsList'
import { routes } from '../../routes/routes'

import ChartsTable from '../../tables/ChartsTable'
import useChartsList from '../../hooks/useChartsList'
import DashboardPageSectionHeader from './DashboardPageSectionHeader'
import ShareChart from '../../components/ShareCharts'

import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useOutletContext()
  const { participants, onSort, onStar, sortBy, sortDirection } =
    useParticipantsList()
  const {
    charts,
    chartToShare,
    closeDialog,
    onShare,
    onDelete,
    onDuplicate,
    shareWithUsers,
    usernames,
  } = useChartsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Dashboard" />
      <section className="DashboardPageSection">
        <DashboardPageSectionHeader
          to={routes.participants}
          title="Participants"
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
      </section>
      <section className="DashboardPageSection">
        <DashboardPageSectionHeader to={routes.charts} title="Charts" />
        <ChartsTable
          charts={charts}
          maxRows={3}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onShare={onShare}
          user={user}
        />
      </section>
      {!!chartToShare._id && (
        <ShareChart
          chart={chartToShare}
          usernames={usernames}
          handleChange={shareWithUsers}
          handleClose={closeDialog}
        />
      )}
    </Box>
  )
}

export default DashboardPage
