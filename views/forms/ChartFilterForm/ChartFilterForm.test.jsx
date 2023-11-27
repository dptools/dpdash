import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ChartFilterForm from '.'

describe('Chart Filter Form', () => {
  const defaultProps = {
    initialValues: {
      chrcrit_part: [
        { name: 'HC', value: 'false' },
        { name: 'CHR', value: 'false' },
        { name: 'Missing', value: 'false' },
      ],
      included_excluded: [
        { name: 'Included', value: 'false' },
        { name: 'Excluded', value: 'false' },
        { name: 'Missing', value: 'false' },
      ],
      sex_at_birth: [
        { name: 'Male', value: 'false' },
        { name: 'Female', value: 'false' },
        { name: 'Missing', value: 'false' },
      ],
      sites: [
        { label: 'CA', value: 'CA' },
        { label: 'LA', value: 'LA' },
      ],
    },
    siteOptions: [
      { label: 'CA', value: 'CA' },
      { label: 'LA', value: 'LA' },
      { label: 'MA', value: 'MA' },
    ],
    onSubmit: () => {},
  }
  const elements = {
    hcField: () =>
      screen.getByRole('checkbox', { name: 'chrcrit_part.0.value' }),
    chrField: () =>
      screen.getByRole('checkbox', { name: 'chrcrit_part.1.value' }),
    includedExcludedMissing: () =>
      screen.getByRole('checkbox', { name: 'included_excluded.2.value' }),
    siteSelect: () => screen.getByRole('combobox', { name: 'Sites' }),
    siteOptions: () => screen.getByRole('listbox'),
    submitBtn: () => screen.getByText('Apply Filters'),
  }
  const renderForm = (props = defaultProps) => {
    render(<ChartFilterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.click(elements.hcField())
    await user.click(elements.includedExcludedMissing())
    const siteSelect = elements.siteSelect()
    await userEvent.type(siteSelect, '{backspace}')
    await userEvent.type(siteSelect, 'm')
    await userEvent.click(screen.getByText('MA'))
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: [
            { name: 'HC', value: true },
            { name: 'CHR', value: 'false' },
            { name: 'Missing', value: 'false' },
          ],
          included_excluded: [
            { name: 'Included', value: 'false' },
            { name: 'Excluded', value: 'false' },
            { name: 'Missing', value: true },
          ],
          sex_at_birth: [
            { name: 'Male', value: 'false' },
            { name: 'Female', value: 'false' },
            { name: 'Missing', value: 'false' },
          ],
          sites: [
            { label: 'CA', value: 'CA' },
            { label: 'MA', value: 'MA' },
          ],
        },
        expect.anything()
      )
    )
  })

  test('does not call the onSubmit prop with no sites', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.click(elements.hcField())
    await user.click(elements.includedExcludedMissing())
    const siteSelect = elements.siteSelect()
    await userEvent.type(siteSelect, '{backspace}')
    await userEvent.type(siteSelect, '{backspace}')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(
        screen.getByText('You must select at least 1 site')
      ).toBeInTheDocument()
    )
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
