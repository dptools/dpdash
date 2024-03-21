import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AdminUsersSearchForm } from '.'

describe('Admin User Search Form', () => {
  const defaultProps = {
    allOptions: [
      { label: 'dpdash', value: 'dpdash' },
      { label: 'asdf', value: 'asdf' },
      { label: 'person', value: 'person' },
    ],
    onSubmit: () => {},
  }
  const elements = {
    searchField: () => screen.getByRole('combobox'),
  }
  const renderForm = (props = defaultProps) => {
    render(<AdminUsersSearchForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)

    user.type(elements.searchField(), 'dpdash')

    userEvent.click(await screen.findByText('dpdash'))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        [{label: 'dpdash', value: 'dpdash'}]
      )
    )
  })
})
