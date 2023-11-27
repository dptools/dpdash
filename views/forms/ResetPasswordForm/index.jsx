import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import TextInput from '../TextInput'

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required().min(8),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords do not match'),
  reset_key: yup.string().required(),
})

const ResetPasswordForm = ({ initialValues, onCancel, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        control={control}
        errors={errors.username}
        fullWidth
        name="username"
        label="Username"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.password}
        fullWidth
        inputProps={{ 'data-testid': 'pw' }}
        name="password"
        label="Password"
        type="password"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.confirmPassword}
        fullWidth
        inputProps={{ 'data-testid': 'confirm-pw' }}
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.reset_key}
        fullWidth
        label="Reset Key"
        margin="normal"
        name="reset_key"
        required={true}
      />

      <div>
        <Button color="primary" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default ResetPasswordForm
