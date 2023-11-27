import React from 'react'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'

import TextInput from '../TextInput'
import './SignInForm.css'

const SignInForm = ({ initialValues, onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        control={control}
        name="username"
        label="Username"
        required={true}
        fullWidth={true}
        margin="normal"
        type="text"
      />
      <TextInput
        control={control}
        fullWidth={true}
        inputProps={{ 'data-testid': 'pw' }}
        label="Password"
        margin="normal"
        name="password"
        required={true}
        type="password"
      />
      <div className="SignInForm_submitBtnContainer">
        <Button
          className="SignInForm_button"
          sx={{
            backgroundColor: 'primary.dark',
          }}
          variant="contained"
          type="submit"
          fullWidth={true}
        >
          Sign in
        </Button>
      </div>
    </form>
  )
}

export default SignInForm
