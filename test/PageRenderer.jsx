import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext, NotificationContext } from '../views/contexts'

const renderPage = (PageComponent, props = {}) =>
  render(
    <MemoryRouter>
      <NotificationContext.Provider value={[{}, jest.fn()]}>
        <AuthContext.Provider value={[{}, jest.fn()]}>
          <PageComponent {...props} />
        </AuthContext.Provider>
      </NotificationContext.Provider>
    </MemoryRouter>
  )

export default renderPage
