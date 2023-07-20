import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@material-ui/core'
import ControlledReactSelect from '../ControlledReactSelect'
import Form from '../Form'

const ShareForm = ({
  classes,
  control,
  onClose,
  onSubmit,
  open,
  options,
  title,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen={true}>
      <DialogTitle
        id="alert-dialog-title"
        disableTypography={true}
        className={classes.dialogTitle}
      >
        <Typography variant="title" className={classes.dialogText}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Form onSubmit={onSubmit}>
          <ControlledReactSelect
            classes={classes}
            isMulti={true}
            control={control}
            name="readers"
            options={options}
            placeholder="Shared with"
          />
          <DialogActions>
            <Button onClick={onClose} className={classes.closeButton}>
              Cancel
            </Button>
            ,
            <Button
              variant="outlined"
              className={classes.submitButton}
              type="submit"
            >
              Submit
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ShareForm
