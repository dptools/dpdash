import React from 'react'
import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AccountPageHeader from './AccountPageHeader'

describe('AccountPageHeader', () => {
  it('renders the banner', () => {
    render(<AccountPageHeader />, { wrapper: MemoryRouter })

    const title = screen.getByText('Profile')
    const logOut = screen.getByRole('button')

    expect(title).toBeInTheDocument()
    expect(logOut).toBeInTheDocument()
  })
})
