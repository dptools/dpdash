import React from 'react'
import { render, screen } from '@testing-library/react'
import SideNavigation from './SideNavigation'
import { MemoryRouter } from 'react-router-dom'
import { createUser } from '../../../test/fixtures'

jest.mock('./SidebarLink')

describe('SideNavigation', () => {
  const user = createUser({ role: 'admin' })

  beforeEach(() => {
    render(
      <MemoryRouter>
        <SideNavigation user={user} />
      </MemoryRouter>
    )
  })

  test('renders SideNavigation component', () => {
    const nav = screen.getByTestId('nav')

    expect(nav).toBeInTheDocument()
  })
})
