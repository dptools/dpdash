import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SearchSelect from '.'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useController: () => jest.fn().mockReturnValue({ field: {} }),
  control: {},
}))

describe('Search Select', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const defaultProps = {
    control: {},
    options: [
      { label: 'AA', value: 'AA' },
      { label: 'BB', value: 'BB' },
      { label: 'CC', value: 'CC' },
    ],
    actions: (
      <div>
        <button>Left</button>
        <button>Right</button>
      </div>
    ),
    name: 'search select',
    formValues: { studies: ['BB'] },
    label: 'search select',
  }
  const elements = {
    searchSelect: () =>
      screen.getByRole('combobox', { label: 'search select' }),
  }
  const renderElement = (props) => render(<SearchSelect {...props} />)

  it('renders a dropdown menu with input and actions', async () => {
    renderElement(defaultProps)

    const searchSelect = elements.searchSelect()

    await userEvent.click(searchSelect)

    const searchSelectInput = await screen.findByLabelText('Find category')
    const optionsPopupEl = await screen.findByRole('listbox')
    const leftActionButton = await screen.findByText('Left')
    const rightActionButton = await screen.findByText('Right')

    expect(optionsPopupEl.childElementCount).toEqual(3)
    expect(searchSelectInput).toBeInTheDocument()
    expect(leftActionButton).toBeInTheDocument()
    expect(rightActionButton).toBeInTheDocument()
  })

  it('filters the list of options based on search', async () => {
    renderElement(defaultProps)

    const searchSelect = elements.searchSelect()

    await userEvent.click(searchSelect)

    const searchSelectInput = await screen.findByLabelText('Find category')

    await userEvent.type(searchSelectInput, 'c')
    const optionsPopupEl = await screen.findByRole('listbox')

    await waitFor(() => expect(optionsPopupEl.childElementCount).toEqual(1))
  })

  it('checks the checkbox when value is within formValues', async () => {
    renderElement(defaultProps)

    const searchSelect = elements.searchSelect()

    await userEvent.click(searchSelect)

    const unchecked = screen.getAllByTestId('CheckBoxOutlineBlankIcon')
    const checked = screen.getAllByTestId('CheckBoxIcon')

    expect(unchecked.length).toBe(2)
    expect(checked.length).toBe(1)
  })
})
