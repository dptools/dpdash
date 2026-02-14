import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ChartFilterForm from '.'
import { SITES_BY_NETWORK } from '../../../constants'

describe('Chart Filter Form', () => {
  const defaultInitialValues = {
    chrcrit_part: {
      HC: { label: 'HC', value: 0 },
      CHR: { label: 'CHR', value: 0 },
      Missing: { label: 'Missing', value: 0 },
    },
    recruitment_status: {
      Recruited: { label: 'Recruited', value: 0 },
      'Not recruited': { label: 'Not Recruited', value: 0 },
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
      ME: { label: 'ME', value: 0 },
    },
    networks: {
      PRESCIENT: { label: 'PRESCIENT', value: 0 },
      ProNET: { label: 'ProNET', value: 0 },
    },
  }

  const defaultProps = {
    initialValues: defaultInitialValues,
    onSubmit: () => {},
  }

  const elements = {
    form: () => screen.getByTestId('filter_form'),
    clearButton: () => screen.getByRole('button', { name: 'Clear' }),
    sitesFilters: () => screen.getByRole('textbox', { name: 'sites' }),
    cohortFilters: () => screen.getByLabelText('Cohort'),
    recruitmentFilters: () => screen.getByLabelText('Recruitment Status'),
    networkFilters: () => screen.getByLabelText('Networks'),
    getFilterElement: (name) => screen.getByText(name),
  }

  const renderForm = (props = defaultProps) => {
    return render(<ChartFilterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const onSubmit = jest.fn()

    renderForm({ ...defaultProps, onSubmit })

    const cohortElement = elements.cohortFilters()
    const recruitmentFilterElement = elements.recruitmentFilters()

    await userEvent.click(cohortElement)
    await userEvent.click(elements.getFilterElement('HC'))
    await userEvent.click(recruitmentFilterElement)
    await userEvent.click(elements.getFilterElement('Recruited'))
    await userEvent.keyboard('{Escape}')

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: ['HC'],
          recruitment_status: ['Recruited'],
          networks: [],
          sex_at_birth: [],
          sites: ['CA', 'LA'],
        },
        expect.anything()
      )
    )
  })

  test('updates the available sites when a network is selected', async () => {
    const prescient = 'PRESCIENT'
    const onSubmit = jest.fn()

    const props = {
      ...defaultProps,
      onSubmit,
    }

    renderForm(props)

    const networksElement = elements.networkFilters()

    await userEvent.click(networksElement)
    await userEvent.click(elements.getFilterElement(prescient))
    await userEvent.keyboard('{Escape}')

    const prescientSites = screen.queryByDisplayValue(
      SITES_BY_NETWORK[prescient].join(',')
    )

    expect(prescientSites).toBeInTheDocument()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: [],
          recruitment_status: [],
          networks: [prescient],
          sex_at_birth: [],
          sites: SITES_BY_NETWORK[prescient],
        },
        expect.anything()
      )
    })
  })
})
