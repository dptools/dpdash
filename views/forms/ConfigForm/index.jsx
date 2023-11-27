import React from 'react'
import { Fab } from '@mui/material'
import { AddCircleOutline, Save } from '@mui/icons-material'

import ConfigFormFields from '../ConfigFields'
import './ConfigForm.css'

const ConfigForm = ({ onSubmit, onAddNewField, ...rest }) => {
  return (
    <form onSubmit={onSubmit}>
      <ConfigFormFields {...rest} />
      <div className="ConfigFormActions">
        <Fab color="primary" onClick={() => onAddNewField()} sx={{ p: '5px' }}>
          <AddCircleOutline />
        </Fab>
        <Fab type="submit" sx={{ p: '5px' }}>
          <Save />
        </Fab>
      </div>
    </form>
  )
}

export default ConfigForm
