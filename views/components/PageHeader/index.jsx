import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { fontSize } from '../../../constants'

const PageHeader = (props) => {
  return props.isDescription ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        columnGap: '20px',
        pb: '20px',
      }}
    >
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

      <Typography
        sx={{
          fontWeight: 600,
          width: 192,
          fontSize: fontSize[16],
          gridColumnStart: 1,
          gridColumnEnd: 5,
          pt: '10px',
        }}
      >
        {props.title}
      </Typography>

      <div style={{ gridColumnStart: 1, gridColumnEnd: 5 }}>
        {props.description}
      </div>
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
