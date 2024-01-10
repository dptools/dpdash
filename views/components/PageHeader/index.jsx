import React from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'

const PageHeader = (props) => {
  return (
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
      <Typography sx={{ fontWeight: 600, width: 192 }}>
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
