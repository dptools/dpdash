import React from 'react'
import { Button } from '@material-ui/core'
import ContentAdd from '@material-ui/icons/Add'
import Save from '@material-ui/icons/Save'
import ConfigFormFields from '../ConfigFields'
import Form from '../Form'

const ConfigForm = ({ onSubmit, classes, onAddNewField, ...rest }) => {
  return (
    <Form onSubmit={onSubmit}>
      <ConfigFormFields classes={classes} {...rest} />
      <div className={classes.configFormButtonContainer}>
        <Button
          variant="fab"
          className={classes.addNewFieldButton}
          onClick={() => onAddNewField()}
        >
          <ContentAdd />
        </Button>
        <Button
          variant="fab"
          className={classes.saveConfigurationButton}
          type="submit"
        >
          <Save />
        </Button>
      </div>
    </Form>
  )
}

export default ConfigForm
