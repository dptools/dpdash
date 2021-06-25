import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const SaveReportDialog = ({
  open,
  reportName,
  saveReport,
  textInputClass,
  handleFormChange,
  disabled,
  onClose,
}) => {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="savereport-dialog-title"
    aria-describedby="savereport-dialog-description"
  >
    <DialogTitle id="savereport-dialog-title">
      Save report
    </DialogTitle>
    <form onSubmit={saveReport}>
      <DialogContent>
        <DialogContentText id="savereport-dialog-description">
          Save these chart settings as a report?
          <TextField
            className={textInputClass}
            label="Name"
            name="reportName"
            value={reportName}
            onChange={handleFormChange}
            fullWidth
            required
            disabled={disabled}
          />
          <small>
            Note: Study selection(s) will not be saved with this report. This is because
            not all users have access to all studies, so sharing a report requires
            each user to choose which studies should appear in the report manually.
          </small>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          onClick={onClose}
          variant="outlined"
          disabled={disabled}
        >
          Close
        </Button>
        <Button
          type="submit"
          color="primary"
          autoFocus             
          disabled={disabled}
        >
          Save
        </Button>
      </DialogActions>
    </form>
  </Dialog>
  )
};

export default SaveReportDialog;
