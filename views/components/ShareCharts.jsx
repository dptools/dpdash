import React from 'react'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Chip from '@material-ui/core/Chip'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'

const menuProps = {
  PaperProps: {
    style: {
      marginTop: '50px',
    },
  },
}

const ShareChart = ({
  chart,
  usernames,
  handleChange,
  handleClose,
  classes,
}) => {
  const [sharedWith, setSharedWith] = React.useState(chart.sharedWith || [])

  return (
    <Dialog open onClose={handleClose} fullScreen={true}>
      <DialogTitle
        id="alert-dialog-title"
        disableTypography={true}
        className={classes.dialogTitle}
      >
        <Typography variant="title" className={classes.dialogTypography}>
          Share your chart
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Select
          multiple
          value={sharedWith}
          onChange={(event) => setSharedWith(event.target.value)}
          input={<Input id="select-multiple" />}
          MenuProps={menuProps}
          fullWidth
          renderValue={(selected) => (
            <>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => {
                    const updatedSharedWith = sharedWith.filter(
                      (username) => username !== value
                    )
                    setSharedWith(updatedSharedWith)

                    if (
                      chart.sharedWith.find((username) => username === value)
                    ) {
                      return handleChange(chart._id, updatedSharedWith, {
                        closeDialog: false,
                      })
                    }
                  }}
                  onMouseDown={(event) => {
                    event.stopPropagation()
                  }}
                />
              ))}
            </>
          )}
        >
          {usernames.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className={classes.dialogCancelButton}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          className={classes.dialogShareButton}
          onClick={() =>
            handleChange(chart._id, sharedWith, { closeDialog: true })
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareChart
