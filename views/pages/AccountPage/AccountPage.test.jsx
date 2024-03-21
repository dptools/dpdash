import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AccountPage from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => {
    return {
      user: {
        display_name: 'Owl',
        icon: 'data:image/png;base64,SGVsbG8sIFdvcmxkIQ==',
        iconFileName: 'profileImage.png',
        mail: 'mail@mail.com',
        title: 'MR',
      },
      setUser: jest.fn(),
      setNotification: jest.fn(),
    }
  },
}))
describe('AccountPage', () => {
  test('it renders the page and the form sections', () => {
    render(<AccountPage />, { wrapper: MemoryRouter })

    const accountPageBanner = screen.getByText('Profile')
    const accountFormProfileImage = screen.getByText('Upload Profile Photo')
    const accountFormInputs = screen.getByRole('textbox', { name: 'Full name' })
    const resetPasswordButton = screen.getByText('Request password change')

    expect(accountPageBanner).toBeInTheDocument()
    expect(accountFormProfileImage).toBeInTheDocument()
    expect(accountFormInputs).toBeInTheDocument()
    expect(resetPasswordButton).toBeInTheDocument()
  })
})
