import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthContext, NotificationContext } from '../../contexts'
import { MemoryRouter } from 'react-router-dom'
import SignInPage from '.'

jest.mock('../../forms/SignInForm')
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    handleSubmit: () => jest.fn(),
  }),
  useFormContext: jest.fn(),
}))

describe('SignIn Page', () => {
  test('Sign In Page renders', () => {
    render(
      <MemoryRouter>
        <NotificationContext.Provider value={[{}, jest.fn()]}>
          <AuthContext.Provider value={[{}, jest.fn()]}>
            <SignInPage />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </MemoryRouter>
    )

    const signInButton = screen.getByText('Sign In')
    const registerCopy = screen.getByText('Need a DPDash Account?')
    const registerLink = screen.getByText('Sign Up')
    const resetPasswordLink = screen.getByText('Request Password Assistance')

    expect(signInButton).toBeInTheDocument()
    expect(registerCopy).toBeInTheDocument()
    expect(registerLink).toBeInTheDocument()
    expect(resetPasswordLink).toBeInTheDocument()
  })
})
