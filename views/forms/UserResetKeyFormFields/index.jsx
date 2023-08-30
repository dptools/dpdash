import Modal from '../../components/Modal'
import Subheader from '@material-ui/core/ListSubheader'
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
