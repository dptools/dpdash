import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import SidebarFooter from './SidebarFooter'
import { createUser } from '../../../test/fixtures'

describe('SidebarFooter', () => {
  const envVars = process.env
  const user = createUser()

  process.env.DPDASH_VERSION = '1.0.0'

  let wrapper

  beforeEach(() => {
    wrapper = render(
      <MemoryRouter>
        <SidebarFooter user={user} />
      </MemoryRouter>
    )
  })
  afterAll(() => {
    process.env = envVars
  })

  test('renders SidebarFooter component with user data', async () => {
    const userNameElement = screen.getByText(user.display_name)
    const userAvatarElement = screen.getByAltText('D')

    expect(userNameElement).toBeInTheDocument()
    expect(userAvatarElement).toBeInTheDocument()
  })

  test('renders Edit Profile and Log Out buttons with correct links', () => {
    const editProfileButton = screen.getByText('Edit Profile')
    const logOutButton = screen.getByText('Log out')

    expect(editProfileButton).toBeInTheDocument()
    expect(editProfileButton).toHaveAttribute('href', '/user-account')
    expect(logOutButton).toBeInTheDocument()
  })

  test('renders DpDash version correctly', () => {
    const versionElement = screen.getByText('DpDash v1.0.0')

    expect(versionElement).toBeInTheDocument()
  })
})
