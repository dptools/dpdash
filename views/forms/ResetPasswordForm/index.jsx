import Form from '../Form'
import TextInput from '../TextInput'
import { Button } from '@material-ui/core'

const ResetPasswordForm = ({
  classes,
  onSubmit,
  control,
  errors,
  navigate,
  onInputChange,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <TextInput
        control={control}
        name="username"
        label="Username"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        name="password"
        label="Password"
        type="password"
        required={true}
        margin="normal"
        onChange={(e) => onInputChange(e)}
        error={errors.password.error}
        helperText={errors.password.message}
      />
      <TextInput
        control={control}
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        onChange={(e) => onInputChange(e)}
        error={errors.confirmPassword.error}
        helperText={errors.confirmPassword.message}
        required={true}
        margin="normal"
      />
      <TextInput
        name="reset_key"
        label="Reset Key"
        control={control}
        required={true}
        margin="normal"
      />

      <div className={classes.register_container_button}>
        <Button
          color="primary"
          onClick={() => navigate(`/login`)}
          className={classes.register_cancel_button}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          type="submit"
          className={classes.register_submit_button}
        >
          Submit
        </Button>
      </div>
    </Form>
  )
}

export default ResetPasswordForm
