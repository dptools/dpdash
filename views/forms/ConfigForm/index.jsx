import React from 'react'
import { Fab } from '@material-ui/core'
import ContentAdd from '@material-ui/icons/Add'
import Save from '@material-ui/icons/Save'
import ConfigFormFields from '../ConfigFields'
import Form from '../Form'

const ConfigForm = ({ onSubmit, classes, onAddNewField, ...rest }) => {
  return (
    <Form onSubmit={onSubmit}>
      <ConfigFormFields classes={classes} {...rest} />
      <div className={classes.configFormButtonContainer}>
        <Fab
          className={classes.addNewFieldButton}
          onClick={() => onAddNewField()}
        >
          <ContentAdd />
        </Fab>
        <Fab className={classes.saveConfigurationButton} type="submit">
          <Save />
        </Fab>
      </div>
    </Form>
  )
}

export default ConfigForm
