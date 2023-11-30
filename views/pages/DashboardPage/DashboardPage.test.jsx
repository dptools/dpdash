import { screen, within, waitFor } from '@testing-library/react'

import {
  createParticipantList,
  createUser,
  createChart,
} from '../../../test/fixtures'
import renderPage from '../../../test/PageRenderer'

import DashboardPage from '.'

const mockUser = createUser()
const mockParticipants = createParticipantList()
const mockedUsers = [
  mockUser,
  createUser({ uid: 'foo' }),
  createUser({ uid: 'bar' }),
]
const mockedCharts = [
  createChart({ chartOwner: { display_name: 'Jane' } }),
  createChart({
    title: 'chart two',
    owner: 'foo',
    chartOwner: { display_name: 'Jack' },
  }),
  createChart({
    title: 'bar chart',
    owner: 'bar',
    chartOwner: { display_name: 'Bert' },
  }),
]

jest.mock(
  'react-router-dom',
  () => {
    return {
      ...jest.requireActual('react-router-dom'),
      useOutletContext: () => {
        return {
          user: mockUser,
          setNotification: jest.fn(),
          users: mockedUsers,
        }
      },
    }
  },
  {}
)

jest.mock('../../api', () => {
  return {
    participants: {
      all: () => Promise.resolve(mockParticipants),
    },
    charts: {
      chart: {
        index: () => mockedCharts,
      },
    },
  }
})
describe('Dashboard Page', () => {
  test('Dashboard Page renders', async () => {
    renderPage(DashboardPage)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  test('Dashboard Page shows 5 rows of Participants', async () => {
    renderPage(DashboardPage)

    await waitFor(() => {
      const participantRows = within(
        screen.getAllByRole('table')[0]
      ).getAllByRole('row')
      expect(participantRows.length).toBe(6)
    })
  })

  test('Renders Charts table', async () => {
    renderPage(DashboardPage)

    await waitFor(() => {
      const chartsTableRows = within(
        screen.getAllByRole('table')[1]
      ).getAllByRole('row')
      expect(chartsTableRows.length).toBe(4)
    })
  })
})
