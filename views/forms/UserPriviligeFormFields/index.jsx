import Modal from '../../components/Modal'
import Subheader from '@material-ui/core/ListSubheader'
import { Button, DialogActions, MenuItem, NoSsr } from '@material-ui/core'
import { components } from '../ControlledReactSelect/components'
import ControlledSelectInput from '../ControlledSelect'
import ControlledReactSelect from '../ControlledReactSelect'
import { ROLE_OPTIONS } from '../../../constants'
import './UserPriviligeFields.css'

const UserPriviligeFields = ({
  currentRowIndex,
  control,
  classes,
  options,
  open,
  onClose,
  onUpdateUser,
}) => {
  return (
    <Modal
      fullScreen={true}
      title="Edit user privilege"
      open={open}
      onClose={onClose}
    >
      <Subheader className="subheader">Membership Level</Subheader>
      <ControlledSelectInput
        control={control}
        name={`users.${currentRowIndex}.role`}
      >
        {ROLE_OPTIONS.map(({ value, label }) => (
          <MenuItem
            value={value}
            key={`users.${currentRowIndex}.role.${value}`}
          >
            {label}
          </MenuItem>
        ))}
      </ControlledSelectInput>
      <div className="divider">
        <Subheader className="subheader">Viewable Studies</Subheader>
        <NoSsr>
          <ControlledReactSelect
            control={control}
            classes={classes}
            name={`users.${currentRowIndex}.access`}
            options={options}
            components={components}
            placeholder="Search a study"
            isMulti
          />
        </NoSsr>
      </div>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={() => onUpdateUser(currentRowIndex)}
          type="submit"
        >
          Update User Access
        </Button>
      </DialogActions>
    </Modal>
  )
}

export default UserPriviligeFields
