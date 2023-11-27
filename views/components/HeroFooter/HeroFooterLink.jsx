import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const HeroFooterLink = ({ to, label }) => {
  return (
    <Typography sx={{ color: 'text.secondary' }} component={Link} to={to}>
      {label}
    </Typography>
  )
}

export default HeroFooterLink
