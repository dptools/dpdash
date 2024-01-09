import React, { forwardRef } from 'react'
import { Paper } from '@mui/material'

const MenuWithFooterActions = forwardRef(function MenuWithFooterActions(
  { children, actions, searchInput, ...other },
  ref
) {
  return (
    <Paper ref={ref} {...other} sx={{ width: '400px' }}>
      {searchInput}
      {children}
      {actions}
    </Paper>
  )
})

export default MenuWithFooterActions
