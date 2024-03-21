import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AuthContext, NotificationContext } from '../views/contexts'

const renderPage = (PageComponent, props = {}) =>
  render(
    <MemoryRouter>
      <NotificationContext.Provider value={[{}, jest.fn()]}>
        <AuthContext.Provider value={[{}, jest.fn()]}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PageComponent {...props} />
          </LocalizationProvider>
        </AuthContext.Provider>
      </NotificationContext.Provider>
    </MemoryRouter>
  )

export default renderPage
