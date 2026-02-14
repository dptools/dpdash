import Subheader from '@mui/material/ListSubheader'

import Modal from '../../components/Modal'
import './UserResetKeyFields.css'

const UserResetKeyFields = ({ open, onClose, resetKey }) => {
  return (
    <Modal
      fullScreen={false}
      title="Reset User Password"
      open={open}
      onClose={onClose}
    >
      <Subheader className="subheader">{resetKey}</Subheader>
    </Modal>
  )
}

export default UserResetKeyFields
