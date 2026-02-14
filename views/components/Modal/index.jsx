import { Typography, DialogTitle, DialogContent, Dialog } from '@mui/material'

const Modal = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <DialogTitle>
        <Typography>{props.title}</Typography>
      </DialogTitle>
      <DialogContent>{props.children}</DialogContent>
    </Dialog>
  )
}

export default Modal
