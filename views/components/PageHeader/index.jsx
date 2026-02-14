import React from 'react'

import { ArrowBack } from '@mui/icons-material'
import { Box, Typography, IconButton } from '@mui/material'

import './PageHeader.css'

const PageHeader = (props) => {
  return props.isDescription ? (
    <Box className="PageHeader">
      <IconButton
        aria-label="back"
        onClick={props.onNavigate}
        sx={{
          color: 'gray.A100',
          gridColumnEnd: 1,
          pl: '0px',
        }}
      >
        <ArrowBack />
      </IconButton>

      <Typography className="PageHeaderTitle">{props.title}</Typography>
      {props.cta && <Box className="PageHeaderCTA">{props.cta}</Box>}
      <div className="PageHeaderDescription">{props.description}</div>
    </Box>
  ) : (
    <Box
      sx={{
        mb: '20px',
        display: 'flex',
        gap: '16px',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'left', lg: 'center' },
      }}
    >
      <Typography sx={{ fontWeight: 600, flexGrow: 0.1 }}>
        {props.title}
      </Typography>

      <Box
        sx={{
          flex: 1,
        }}
      >
        {props.form}
      </Box>

      {props.cta && <Box>{props.cta}</Box>}
    </Box>
  )
}

export default PageHeader
