import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom' // Use MemoryRouter for testing routes
import Sidebar from '.'
import { createUser } from '../../../test/fixtures'

describe('Sidebar', () => {
  const user = createUser()

  beforeEach(() => {
    render(<Sidebar user={user} sidebarOpen={true} onLogout={jest.fn()} />, {
      wrapper: BrowserRouter,
    })
  })

  test('renders the Logo, Navigation and Footer', async () => {
    const logo = screen.getByAltText('dpdash logo')
    const navigation = screen.getByTestId('nav')
    const footer = screen.getByAltText('D')

    expect(logo).toHaveAttribute('src', '/img/dpdash.png')
    expect(navigation).toBeInTheDocument()
    expect(footer).toBeInTheDocument()
  })

  test('it renders the side navigation items', () => {
    const dashboard = screen.getByText('Dashboard')
    const charts = screen.getByText('Charts')
    const participants = screen.getByText('Participants')
    const configurations = screen.getByText('Configurations')
    const help = screen.getByText('Help')

    expect(dashboard).toBeInTheDocument()
    expect(charts).toBeInTheDocument()
    expect(participants).toBeInTheDocument()
    expect(configurations).toBeInTheDocument()
    expect(help).toBeInTheDocument()
  })
})
