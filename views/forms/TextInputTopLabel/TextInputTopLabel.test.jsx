import React from 'react'
import { render, screen } from '@testing-library/react'
import TextInputTopLabel from '.'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useController: jest.fn().mockReturnValue({
    field: { value: 'testValue', onChange: jest.fn() },
    formState: {
      errors: { ['text-field']: { message: 'This field is required' } },
    },
  }),
}))

describe('TextInputTopLabel', () => {
  test('renders TextInputTopLabel component', () => {
    render(<TextInputTopLabel label="text-field-label" name="text-field" />)

    const inputElement = screen.getByRole('textbox', {
      name: 'text-field-label',
    })

    expect(inputElement).toBeInTheDocument()
  })

  test('renders TextInputTopLabel component with error message', () => {
    render(<TextInputTopLabel label="text-field-label" name="text-field" />)

    const inputElement = screen.getByRole('textbox', {
      name: 'text-field-label',
    })
    const errorMessageElement = screen.getByLabelText('text-field-error')

    expect(inputElement).toBeInTheDocument()
    expect(errorMessageElement).toBeInTheDocument()
    expect(errorMessageElement).toHaveTextContent('This field is required')
  })
})
