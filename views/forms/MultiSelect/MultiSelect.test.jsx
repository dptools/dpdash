import React, { useState } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MultiSelect } from '.'
import { text } from 'body-parser'

describe('Controlled Multi Select', () => {
  const defaultComponentProps = {
    label: 'Input label',
    name: 'field_name',
    options: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
      { label: 'Three', value: '3' },
    ],
  }
  const defaultProps = {
    initialValues: [],
    onChange: () => {},
    componentProps: defaultComponentProps,
  }
  const elements = {
    autoComplete: () => screen.getByRole('combobox', { name: 'Input label' }),
  }
  const FormWrapper = (props) => {
    const [value, setValue] = useState(props.initialValues)

    return (
      <form>
        <MultiSelect  value={value}
                      onChange={(v) => { setValue(v); props.onChange(v) }}
                      {...props.componentProps} />
      </form>
    )
  }
  const renderComponent = (props = defaultProps) => {
    render(<FormWrapper {...props} />)
  }

  test('allows selecting a new option', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const props = { ...defaultProps, onChange }

    renderComponent(props)
    const textbox = elements.autoComplete()
    await userEvent.type(textbox, 'o')
    await userEvent.click(await screen.findByText('One'))
    await userEvent.type(textbox, 't')
    await userEvent.click(await screen.findByText('Two'))

    await waitFor(() => (
      expect(onChange).toHaveBeenLastCalledWith(
        [
          defaultComponentProps.options[0],
          defaultComponentProps.options[1],
        ],
      )
    ))


  })

  test('removing an existing option', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const props = {
      ...defaultProps,
      initialValues:[
        defaultComponentProps.options[1],
        defaultComponentProps.options[2],
      ],
      onChange,
    }

    renderComponent(props)
    await userEvent.type(elements.autoComplete(), '{backspace}')

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        [defaultComponentProps.options[1]],
      )
    )
  })
})
