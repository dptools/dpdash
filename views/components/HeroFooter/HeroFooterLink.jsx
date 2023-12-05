import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
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
