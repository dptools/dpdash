import Form from '../Form'
import { Button, Tooltip } from '@material-ui/core'
import TextInput from '../TextInput'
import getAvatar from '../../fe-utils/avatarUtil'
import { EMAIL_REGEX } from '../../../constants'
import { Controller } from 'react-hook-form'

const UserProfileForm = ({ classes, control, onSubmit, setUser, user }) => {
  return (
    <Form onSubmit={onSubmit}>
      <Controller
        control={control}
        name="icon"
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <div className={classes.userAvatar}>
              <input
                accept="image/*"
                id="icon"
                multiple
                type="file"
                className={classes.userAvatarInput}
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  const { files } = event.target

                  if (files[0]) {
                    const reader = new FileReader()

                    reader.readAsDataURL(files[0])
                    reader.onload = (e) => {
                      setUser({ ...user, icon: e.target.result })
                      onChange(e.target.result)
                    }
                  }
                }}
              />
              <label htmlFor="icon">
                <span className={classes.userAvatarContainer}>
                  <Tooltip title="Edit Profile Photo">
                    {getAvatar({ user })}
                  </Tooltip>
                </span>
              </label>
            </div>
          )
        }}
      />
      <TextInput
        control={control}
        className={classes.formInputSpacing}
        label="Full Name"
        name="display_name"
        fullWidth={true}
      />
      <TextInput
        control={control}
        className={classes.formInputSpacing}
        label="Email"
        type="email"
        pattern={EMAIL_REGEX}
        name="mail"
        fullWidth={true}
      />
      <TextInput
        control={control}
        className={classes.formInputSpacing}
        label="Title"
        name="title"
        fullWidth={true}
      />
      <TextInput
        control={control}
        className={classes.formInputSpacing}
        label="Department"
        name="department"
        fullWidth={true}
      />
      <TextInput
        control={control}
        className={classes.formInputSpacing}
        label="Company"
        name="company"
        fullWidth={true}
      />
      <div className={classes.formSubmitButtonContainer}>
        <Button
          className={classes.formSubmitButton}
          variant="outlined"
          type="submit"
        >
          Save
        </Button>
      </div>
    </Form>
  )
}

export default UserProfileForm
