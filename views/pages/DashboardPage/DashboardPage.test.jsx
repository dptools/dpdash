import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AuthContext, NotificationContext } from '../../contexts'
import { createParticipantList, createUser } from '../../../test/fixtures'

import DashboardPage from '.'

const mockUser = createUser()
const mockParticipants = createParticipantList()

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useOutletContext: () => {
      return {
        user: mockUser
      }
    }
  }
}, { })

jest.mock('../../api', () =>{
  return {
    participants: {
      all: () => Promise.resolve(mockParticipants)
    },
  }
})
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
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
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
      const participantRows = within(screen.getAllByRole('table')[0]).getAllByRole('row')
      expect(participantRows.length).toBe(6)
    })
  })
})
