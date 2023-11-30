import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

import { fontSize } from '../../../constants'

const DashboardPageSectionHeader = ({ title, to }) => {
  return (
    <span>
      <Typography
        variant="body"
        sx={{ fontSize: fontSize[20], fontWeight: 600, pr: '16px' }}
      >
        {title}
      </Typography>
      <Typography
        component={Link}
        to={to}
        sx={{ fontSize: fontSize[12], color: 'text.primary' }}
      >
        View All
      </Typography>
    </span>
  )
}

export default DashboardPageSectionHeader
