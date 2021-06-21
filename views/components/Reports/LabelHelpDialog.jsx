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
            variable value&rdquo; button. 
          </p>
          <p>
            <strong>Grouping:</strong> You may group multiple raw values
            together by entering them as a comma-separated list: for example,
            &ldquo;1,2,3&rdquo; under &ldquo;Value&rdquo; and then your grouping
            name under &ldquo;Label/Group&rdquo;. Ensure that there are no extra
            spaces as the raw values will be matched exactly to the database.
          </p>
          <p>
            <strong>Ranges:</strong> For numeric values, you may also group
            raw values together by range. To do this, enter the minimum and
            maximum value separated by a single hyphen: for example,
            &ldquo;1-3&rdquo; under &ldquo;Value&rdquo;.
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
