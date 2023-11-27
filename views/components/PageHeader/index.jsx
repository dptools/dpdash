import React from 'react'
import { Box, Typography } from '@mui/material'

const PageHeader = (props) => {
  return (
    <Box
      sx={{
        mb: '20px',
        display: 'flex',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 600, width: 192 }}>
        {props.title}
      </Typography>

      <Box sx={{ flex: 1 }}>{props.form}</Box>

      {props.cta && <Box>{props.cta}</Box>}
    </Box>
  )
}

export default PageHeader
