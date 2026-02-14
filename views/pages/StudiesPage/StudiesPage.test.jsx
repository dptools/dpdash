import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'

import StudiesPage from '.'
import { createStudyTableRowData } from '../../../test/fixtures'
import api from '../../api'

describe(StudiesPage, () => {
  const renderPage = () => render(<StudiesPage />)
  beforeEach(() => {
    jest.spyOn(api.userStudies, 'loadAll').mockResolvedValueOnce([
      createStudyTableRowData({
        daysInStudy: 655,
        numOfParticipants: 2,
        study: 'LA',
        updatedAt: '2024-01-05T06:00:00.000Z',
      }),
    ])
  })
  it('renders the studies page header', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Studies')).toBeInTheDocument()
    })
  })

  it('renders the studies page table', async () => {
    renderPage()

    const table = screen.getByRole('table')

    await waitFor(() => {
      expect(table).toBeInTheDocument()
    })
  })
})
