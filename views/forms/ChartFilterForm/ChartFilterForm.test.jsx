import React from 'react'
import { render, screen, waitFor, fireEvent, queryByAttribute } from '@testing-library/react'
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
  const getById = queryByAttribute.bind(null, 'id');
  const elements = {
    form: () => screen.getByTestId('filter_form')
  }

  const renderForm = (props = defaultProps) => {
    return render(<ChartFilterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    const {container} = renderForm(props)

    await fireEvent.change(getById(container, 'select-multiple-chrcrit_part'),{ target: { value: "HC"}})
    await fireEvent.change(getById(container, 'select-multiple-included_excluded'), { target: { value: "Missing"}})
    await fireEvent.change(getById(container, 'select-multiple-sites'), { target: { value: "MA"}})
    fireEvent.submit(elements.form())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: {
            HC: { label: 'HC', value: 1 },
            CHR: { label: 'CHR', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          included_excluded: {
            Included: { label: 'Included', value: 0 },
            Excluded: { label: 'Excluded', value: 0 },
            Missing: { label: 'Missing', value: 1 },
          },
          sex_at_birth: {
            Male: { label: 'Male', value: 0 },
            Female: { label: 'Female', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          sites: {
            CA: { label: 'CA', value: 0 },
            LA: { label: 'LA', value: 0 },
            MA: { label: 'MA', value: 1 },
          },
        },
        expect.anything()
      )
    )
  })
})
