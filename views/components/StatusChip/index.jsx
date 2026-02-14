import React from 'react'

import { Chip } from '@mui/material'

import { borderRadius, fontSize } from '../../../constants'

const StatusChip = ({ isActive }) => {
  return (
    <Chip
      sx={{
        backgroundColor: isActive ? 'primary.light' : 'grey.A300',
        color: isActive ? 'text.secondary' : 'text.primary',
        fontSize: fontSize[14],
        fontWeight: 500,
        p: isActive ? '0 19px 0 15px' : '0 10px',
        borderRadius: borderRadius[24],
      }}
      label={isActive ? 'Active' : 'Inactive'}
    />
  )
}

export default StatusChip
