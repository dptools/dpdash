import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const SavePresetDialog = ({
  open,
  presetName,
  savePreset,
  textInputClass,
  handleFormChange,
  disabled,
  onClose,
}) => {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="savepreset-dialog-title"
    aria-describedby="savepreset-dialog-description"
  >
    <DialogTitle id="savepreset-dialog-title">
      Save preset
    </DialogTitle>
    <form onSubmit={savePreset}>
      <DialogContent>
        <DialogContentText id="savepreset-dialog-description">
          Save these chart settings as a preset?
          <TextField
            className={textInputClass}
            label="Name"
            name="presetName"
            value={presetName}
            onChange={handleFormChange}
            fullWidth
            required
            disabled={disabled}
          />
          <small>
            Note: Study selection(s) will not be saved with this preset. This is because
            not all users have access to all studies, so sharing a preset requires
            each user to choose which studies should appear in the report manually.
          </small>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
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

export default SavePresetDialog;
