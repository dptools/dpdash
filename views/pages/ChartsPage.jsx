import React from 'react'
import { Box, Button } from '@mui/material'
import { Link, useOutletContext } from 'react-router-dom'

import ChartsTable from '../tables/ChartsTable'
import PageHeader from '../components/PageHeader'
import ShareChart from '../components/ShareCharts'
import { routes } from '../routes/routes'

import useChartsList from '../hooks/useChartsList'

const ChartsPage = () => {
  const { user } = useOutletContext()
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
      <PageHeader
        title="Charts"
        cta={
          <Button
            component={Link}
            to={routes.newChart}
            variant="contained"
            size="small"
            sx={{ backgroundColor: 'primary.dark', textTransform: 'none' }}
          >
            New chart
          </Button>
        }
      />
      <ChartsTable
        onShare={onShare}
        charts={charts}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        user={user}
      />
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

export default ChartsPage
