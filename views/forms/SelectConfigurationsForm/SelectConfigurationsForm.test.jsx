import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SelectConfigurationForm from '.'
import { createConfiguration } from '../../../test/fixtures'

describe(SelectConfigurationForm, () => {
  const defaultInitialValues = {
    config: '1',
  }
  const defaultProps = {
    initialValues: defaultInitialValues,
    configurations: [],
    onSubmit: () => {},
  }

  const elements = {
    configurationsDropdown: () =>
      screen.getByRole('combobox', { name: 'Select configuration' }),
    getFilterElement: (name) => screen.getByText(name),
  }
  const renderForm = (props = defaultProps) => {
    return render(<SelectConfigurationForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const onSubmit = jest.fn()
    const configurationsOptions = [
      createConfiguration({ name: 'first config' }),
      createConfiguration({ _id: '2', name: 'second config' }),
      createConfiguration({ _id: '3', name: 'third configuration' }),
    ]

    renderForm({
      ...defaultProps,
      configurations: configurationsOptions,
      onSubmit,
    })

    const configurations = elements.configurationsDropdown()

    await userEvent.click(configurations)
    await userEvent.click(elements.getFilterElement('third configuration'))
    await userEvent.keyboard('{Escape}')

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          config: '3',
        },
        expect.anything()
      )
    )
  })
})
