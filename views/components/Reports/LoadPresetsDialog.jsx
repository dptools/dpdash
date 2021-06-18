import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const LoadPresetsDialog = ({
  open,
  presets,
  loadPreset,
  disabled,
  onClose,
}) => {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="loadpreset-dialog-title"
    aria-describedby="loadpreset-dialog-description"
  >
    <DialogTitle id="loadpreset-dialog-title">
      Load preset
    </DialogTitle>
    <DialogContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {presets && Array.isArray(presets) && presets.length > 0 && presets.map(preset => (
            <TableRow key={preset._id}>
              <TableCell component="th" scope="row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => loadPreset(preset)}
                >
                Load
                </Button>
              </TableCell>
              <TableCell align="right">{preset.presetName}</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </DialogActions>
  </Dialog>
  );
};

export default LoadPresetsDialog;
