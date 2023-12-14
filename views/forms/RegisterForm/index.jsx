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
  fullName: yup.string().required(),
  mail: yup.string().required().email(),
})

const RegistrationForm = ({ initialValues, onSubmit }) => {
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
        label="Username"
        name="username"
        required
      />
      <TextInput
        control={control}
        errors={errors.password}
        fullWidth
        inputProps={{ 'data-testid': 'pw' }}
        label="Password"
        name="password"
        required
        type="password"
      />
      <TextInput
        control={control}
        errors={errors.confirmPassword}
        fullWidth
        inputProps={{ 'data-testid': 'confirm-pw' }}
        label="Confirm Password"
        name="confirmPassword"
        required
        type="password"
      />
      <TextInput
        control={control}
        errors={errors.fullName}
        fullWidth
        label="Full Name"
        name="fullName"
        required
      />
      <TextInput
        control={control}
        errors={errors.mail}
        fullWidth
        label="Email"
        name="mail"
        required
        sx={{ pb: '16.5px' }}
      />

      <Button
        variant="outlined"
        type="submit"
        fullWidth
        sx={{
          backgroundColor: 'primary.dark',
          color: 'common.white',
          borderRadius: '8px',
          textTransform: 'none',
        }}
      >
        Sign up
      </Button>
    </form>
  )
}

export default RegistrationForm
