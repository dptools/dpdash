import React from 'react'
import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegistrationPage from '.'
import { NotificationContext } from '../../contexts'
import { routes } from '../../routes/routes'

describe('Registration Page', () => {
  test('renders the page', () => {
    render(
      <NotificationContext.Provider value={[{}, jest.fn()]}>
        <RegistrationPage />
      </NotificationContext.Provider>,
      { wrapper: MemoryRouter }
    )

    const pageTitle = screen.getByText('Sign up')
    const signInLink = screen.getByText('Sign in')
    const formInputs = screen.getAllByRole('textbox')

    expect(pageTitle).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', routes.signin)
    expect(formInputs.length).toBe(3)
  })
})
