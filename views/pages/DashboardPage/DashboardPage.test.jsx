import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import { AuthContext, NotificationContext } from '../../contexts'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => {
    return {
      user: {
        display_name: 'Owl',
        icon: 'data:image/png;base64,SGVsbG8sIFdvcmxkIQ==',
        iconFileName: 'profileImage.png',
        uid: '1234'
      }
    }
  }
}))
jest.mock('../../api', () => ({
  participants: {
    all: () => Promise.resolve([
            {
                "subject": "CA00066",
                "days": 1,
                "study": "CA",
                "star": true,
                "complete": true
            },
            {
                "subject": "CA00063",
                "days": 1,
                "study": "CA",
                "star": false,
                "complete": true
            },
            {
                "subject": "CA00064",
                "days": 1,
                "study": "CA",
                "star": false,
                "complete": false
            },
            {
                "subject": "CA00057",
                "days": 1,
                "study": "CA",
                "star": false,
                "complete": true
            },
            {
                "subject": "CA00007",
                "days": 1,
                "study": "CA",
                "star": false,
                "complete": true
            },
            {
                "subject": "CA00073",
                "days": 1,
                "study": "CA",
                "star": false,
                "complete": false
            },
            {
                "subject": "CA",
                "days": 9999,
                "study": "files",
                "star": false,
                "complete": true
            }
        ])
    },
}))
describe('Dashboard Page', () => {
  
  test('Dashboard Page renders', async () => {
    render(
      <MemoryRouter>
        <NotificationContext.Provider value={[{}, jest.fn()]}>
          <AuthContext.Provider value={[{}, jest.fn()]}>
            <DashboardPage />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      screen.getByText('Dashboard')
    })
    const dashboardTitle = screen.getByText('Dashboard')
    expect(dashboardTitle).toBeInTheDocument()
  })

  test('Dashboard Page shows 5 rows of Participants', async () => {
    render(
      <MemoryRouter>
        <NotificationContext.Provider value={[{}, jest.fn()]}>
          <AuthContext.Provider value={[{}, jest.fn()]}>
            <DashboardPage />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      screen.getByText('Dashboard')
    })

    const participantRows = within(screen.getAllByRole('table')[0]).getAllByRole('row')
    expect(participantRows.length).toBe(6)
  })
})
