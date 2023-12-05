import React from 'react';

import { render, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MemoryRouter } from 'react-router-dom';

import AdminPage from '.'
import { createUser } from '../../../test/fixtures';
import { AuthContext, NotificationContext } from '../../contexts';

const mockUser = createUser()
const mockUsers = [createUser(), createUser()]

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useOutletContext: () => {
      return {
        user: mockUser,
        users: mockUsers
      }
    }
  }
}, { })
describe('Admin Page', () => {
  it('renders the page', () => {
    render(
      <MemoryRouter>
      <NotificationContext.Provider value={[{}, jest.fn()]}>
        <AuthContext.Provider value={[{}, jest.fn()]}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <AdminPage />
          </LocalizationProvider>
        </AuthContext.Provider>
      </NotificationContext.Provider>
    </MemoryRouter>
    );

    const pageTitle = screen.getByText('Admin');

    expect(pageTitle).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  })
})
