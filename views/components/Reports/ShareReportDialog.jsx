import React from 'react';
import ReactSelect from 'react-select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { 
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
} from '../MultiSelect';

const ShareReportDialog = ({
  open,
  shareState,
  handleSharingChange,
  saveSharing,
  options,
  disabled,
  onClose,
  classes,
  selectStyles,
}) => {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="sharing-dialog-title"
    aria-describedby="sharing-dialog-description"
  >
    <DialogTitle id="sharing-dialog-title">
      Share report
    </DialogTitle>
    <form onSubmit={saveSharing}>
      <DialogContent>
        <DialogContentText id="sharing-dialog-description">
          This report is shared with the following users:
          <ReactSelect
            classes={classes}
            styles={selectStyles}
            name="studies"
            options={options}
            components={{ 
              Control,
              Menu,
              MultiValue,
              NoOptionsMessage,
              Option,
              Placeholder,
              SingleValue,
              ValueContainer,
            }}
            value={shareState.readers 
              ? shareState.readers.map(user => ({
                  value: user, label: user,
                })) 
              : []}
            onChange={handleSharingChange}
            placeholder="Users"
            isMulti
            isDisabled={disabled}
          />
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
  );
};

export default ShareReportDialog;
