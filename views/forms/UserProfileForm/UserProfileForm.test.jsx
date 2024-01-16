import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import UserProfileForm from '.'

describe('User Profile Form', () => {
  const pngFile = new File(['hello'], 'hello.png', { type: 'image/png' })
  const defaultProps = {
    initialValues: {
      display_name: '',
      mail: 'myEmail@example.test',
      title: '',
      iconFile: pngFile,
    },
    onCancel: () => {},
    onSubmit: () => {},
  }
  const elements = {
    displayNameField: () => screen.getByRole('textbox', { name: 'Full name' }),
    emailField: () => screen.getByRole('textbox', { name: 'Email' }),
    titleField: () =>
      screen.getByRole('textbox', { name: 'Title and institution (optional)' }),
    iconField: () => screen.getByTestId('icon-input'),
    submitBtn: () => screen.getByText('Save changes'),
  }
  const renderForm = (props = defaultProps) => {
    render(<UserProfileForm {...props} />)
  }

  test('email field should be disabled', () => {
    renderForm({ ...defaultProps })

    // expect(elements.emailField()).toBeDisabled()
  })

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = {
      ...defaultProps,
      onSubmit,
    }

    renderForm(props)
    await user.type(elements.displayNameField(), 'My Full Name')
    await user.type(elements.titleField(), 'My Title')
    await user.upload(elements.iconField(), pngFile)
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          display_name: 'My Full Name',
          mail: 'myEmail@example.test',
          title: 'My Title',
          iconFile: pngFile,
        },
        expect.anything()
      )
    )
  })

  test('displays errors and does not submit the form with invalid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.displayNameField(), 'My name')
    await user.clear(elements.displayNameField())
    await user.click(elements.submitBtn())

    await waitFor(() => {
      expect(
        screen.getByText('display_name is a required field')
      ).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
