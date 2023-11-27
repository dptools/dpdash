import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SignInForm from '.'

describe('Sign In Form', () => {
  const defaultProps = {
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: () => {},
  }
  const elements = {
    usernameField: () => screen.getByRole('textbox', { name: 'Username' }),
    passwordField: () => screen.getByTestId('pw'),
    submitBtn: () => screen.getByText('Sign in'),
  }
  const renderForm = (props = defaultProps) => {
    render(<SignInForm {...props} />)
  }

  test('renders the text inputs and submit button', () => {
    renderForm()

    expect(elements.usernameField()).toBeInTheDocument()
    expect(elements.passwordField()).toBeInTheDocument()
    expect(elements.submitBtn()).toBeInTheDocument()
  })

  test('calls the onSubmit prop when the form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.usernameField(), 'myUsername')
    await user.type(elements.passwordField(), 'myPassword')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          username: 'myUsername',
          password: 'myPassword',
        },
        expect.anything()
      )
    )
  })
})
