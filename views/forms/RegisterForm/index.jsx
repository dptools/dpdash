import Form from '../Form'
import TextInput from '../TextInput'
import { Button } from '@material-ui/core'

const RegistrationForm = ({
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
        type="password"
        name="password"
        label="Password"
        required={true}
        margin="normal"
        onChange={(e) => onInputChange(e)}
        error={errors.password.error}
        helperText={errors.password.message}
      />
      <TextInput
        control={control}
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        onChange={(e) => onInputChange(e)}
        required={true}
        error={errors.confirmPassword.error}
        helperText={errors.confirmPassword.message}
        margin="normal"
      />
      <TextInput
        name="fullName"
        label="Full Name"
        control={control}
        required={true}
        margin="normal"
        onChange={(e) => onInputChange(e)}
      />
      <TextInput
        name="email"
        label="Email"
        control={control}
        required={true}
        margin="normal"
        onChange={(e) => onInputChange(e)}
        error={errors.email.error}
        helperText={errors.email.message}
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

export default RegistrationForm
