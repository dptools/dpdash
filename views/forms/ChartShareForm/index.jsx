import React from 'react'

import {
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

import SearchSelect from '../../components/SearchSelect'

const ChartShareForm = ({
  chartToShare,
  closeDialog,
  shareWithUsers,
  sharedWithOptions,
  shareFormControl,
  shareFormValues,
  clearSelectedUsers,
  selectAllUsers,
}) => {
  return (
    <Dialog
      open={Boolean(chartToShare._id)}
      onClose={closeDialog}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: shareWithUsers,
      }}
    >
      <DialogTitle>Share Chart {chartToShare.title}?</DialogTitle>

      <DialogContent>
        <SearchSelect
          name="sharedWith"
          control={shareFormControl}
          options={sharedWithOptions}
          formValues={shareFormValues}
          label="Share chart"
          actions={
            <CardActions
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              }}
            >
              <Button color="primary" fullWidth onClick={clearSelectedUsers}>
                CLEAR
              </Button>
              <Button
                color="primary"
                fullWidth
                onClick={selectAllUsers}
                sx={{ gridColumnStart: 4, gridColumnEnd: 6 }}
              >
                SELECT ALL
              </Button>
            </CardActions>
          }
        />
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button data-testid="submit" type="submit">
          Share
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChartShareForm
