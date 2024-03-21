import React from 'react'

import { screen } from '@testing-library/react'

import AdminUsersTable from '.'
import { createUser } from '../../../test/fixtures'
import renderPage from '../../../test/PageRenderer'

describe('AdminUsersTable', () => {
  const users = [
    createUser({
      uid: 'user',
      mail: 'test@example.com',
      role: 'admin',
    }),
    createUser({
      uid: 'foo',
      mail: 'foo@example.com',
      role: 'member',
    }),
  ]
  it('renders the table', () => {
    renderPage(AdminUsersTable, {users, onAccess: jest.fn(), onUserBlock: jest.fn(), onResetPassword: jest.fn(), onDeleteUser: jest.fn(), onChangeAccountExpiration: jest.fn()})

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('foo@example.com')).toBeInTheDocument()
  })
})
