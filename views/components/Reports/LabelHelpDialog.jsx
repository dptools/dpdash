import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const LabelHelpDialog = ({
  open,
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
        Add label/grouping for variable value
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="savepreset-dialog-description">
          <p>
            Sometimes, the raw values for a variable do not give enough
            information on their own for the purposes of making charts.
          </p>
          <p>
            To remedy this, you may add labels for any possible raw value
            of a variable by clicking the &ldquo;Add label/grouping for
            variable value&rdquo; button. You may group multiple values
            together by using the same label for multiple values (though the
            label must be identical, case-sensitive, for each value you want
            grouped together).
          </p>
          <p>
            If you do not add labels, the labels on the chart will simply be
            populated with the raw values from the original data.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelHelpDialog;
