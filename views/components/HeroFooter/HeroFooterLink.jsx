import React from 'react'

import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { fontSize } from '../../../constants'

const HeroFooterLink = ({ to, label }) => {
  return (
    <Typography
      sx={{ color: 'text.secondary', fontSize: { sm: fontSize[12] } }}
      component={Link}
      to={to}
    >
      {label}
    </Typography>
  )
}

export default HeroFooterLink
