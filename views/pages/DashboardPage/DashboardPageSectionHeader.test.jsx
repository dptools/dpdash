import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPageSectionHeader from './DashboardPageSectionHeader'

describe('DashboardPageSectionHeader', () => {
  it('renders a header with a title and a View All text with an href property', () => {
    render(<DashboardPageSectionHeader to="/some-route" title="Section" />, {
      wrapper: MemoryRouter,
    })

    const viewAll = screen.getByText('View All')
    const title = screen.getByText('Section')

    expect(title).toBeInTheDocument()
    expect(viewAll).toHaveAttribute('href', '/some-route')
  })
})
