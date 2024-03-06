import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ChartFilterForm from '.'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: ({ control: {}, name }) => {
    if (name === 'chrcrit_part')
      return {
        HC: { label: 'HC', value: 0 },
        CHR: { label: 'CHR', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }

    if (name === 'included_excluded')
      return {
        Included: { label: 'Included', value: 0 },
        Excluded: { label: 'Excluded', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }
    if (name === 'sex_at_birth')
      return {
        Male: { label: 'Male', value: 0 },
        Female: { label: 'Female', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }

    if (name === 'sites')
      return {
        CA: { label: 'CA', value: 1 },
        LA: { label: 'LA', value: 1 },
        MA: { label: 'MA', value: 0 },
      }
  },
}))

describe('Chart Filter Form', () => {
  const defaultProps = {
    initialValues: {
      chrcrit_part: {
        HC: { label: 'HC', value: 0 },
        CHR: { label: 'CHR', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      },
      included_excluded: {
        Included: { label: 'Included', value: 0 },
        Excluded: { label: 'Excluded', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      },
      sex_at_birth: {
        Male: { label: 'Male', value: 0 },
        Female: { label: 'Female', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      },
      sites: {
        CA: { label: 'CA', value: 1 },
        LA: { label: 'LA', value: 1 },
        MA: { label: 'MA', value: 0 },
      },
    },
    onSubmit: () => {},
  }
  const elements = {
    form: () => screen.getByTestId('filter_form'),
    chrAndHc: () => screen.getByLabelText('chrcrit_part'),
    includedExcludedMissing: () => screen.getByLabelText('included_excluded'),
    sites: () => screen.getByLabelText('sites'),
    chrFilter: () =>
      screen.getByRole('checkbox', { name: 'chrcrit_part.HC.value' }),
    incExMiFilter: () =>
      screen.getByRole('checkbox', { name: 'included_excluded.Missing.value' }),
    siteFilter: () => screen.getByRole('checkbox', { name: 'sites.MA.value' }),
  }
  const renderForm = (props = defaultProps) => {
    render(<ChartFilterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.click(elements.chrAndHc())
    await user.click(elements.chrFilter())
    await user.click(elements.includedExcludedMissing())
    await user.click(elements.incExMiFilter())
    await user.click(elements.sites())
    await user.click(elements.siteFilter())

    fireEvent.submit(elements.form())
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: {
            HC: { label: 'HC', value: true },
            CHR: { label: 'CHR', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          included_excluded: {
            Included: { label: 'Included', value: 0 },
            Excluded: { label: 'Excluded', value: 0 },
            Missing: { label: 'Missing', value: true },
          },
          sex_at_birth: {
            Male: { label: 'Male', value: 0 },
            Female: { label: 'Female', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          sites: {
            CA: { label: 'CA', value: 1 },
            LA: { label: 'LA', value: 1 },
            MA: { label: 'MA', value: true },
          },
        },
        expect.anything()
      )
    )
  })
})
