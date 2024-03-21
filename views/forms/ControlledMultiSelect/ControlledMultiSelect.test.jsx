import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import ControlledMultiSelect from '.'

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
    initialValues: { field_name: [] },
    onSubmit: () => {},
    componentProps: defaultComponentProps,
  }
  const elements = {
    autoComplete: () => screen.getByRole('combobox', { name: 'Input label' }),
    submitBtn: () => screen.getByRole('button', { name: 'submit' }),
  }
  const FormWrapper = (props) => {
    const { control, handleSubmit } = useForm({
      defaultValues: props.initialValues,
    })

    return (
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <ControlledMultiSelect control={control} {...props.componentProps} />

        <input type="submit" value="submit" />
      </form>
    )
  }
  const renderComponent = (props = defaultProps) => {
    render(<FormWrapper {...props} />)
  }

  test('allows selecting a new option', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderComponent(props)
    const textbox = elements.autoComplete()
    await userEvent.type(textbox, 'o')
    await userEvent.click(await screen.findByText('One'))
    await userEvent.type(textbox, 't')
    await userEvent.click(await screen.findByText('Two'))
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          field_name: [
            defaultComponentProps.options[0],
            defaultComponentProps.options[1],
          ],
        },
        expect.anything()
      )
    )
  })

  test('removing an existing option', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = {
      ...defaultProps,
      initialValues: {
        field_name: [
          defaultComponentProps.options[1],
          defaultComponentProps.options[2],
        ],
      },
      onSubmit,
    }

    renderComponent(props)
    await userEvent.type(elements.autoComplete(), '{backspace}')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          field_name: [defaultComponentProps.options[1]],
        },
        expect.anything()
      )
    )
  })

  test('fixed value remains after input field has been cleared', async () => {
    const user = userEvent.setup()

    const onSubmit = jest.fn()
    const defaultComponentPropsWithStaticOption = {
      label: 'Input label',
      name: 'field_name',
      options: [
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3', isFixed: true },
      ],
    }
    const updatedProps = {
      initialValues: {
        field_name: [
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
          { label: 'Three', value: '3', isFixed: true },
        ],
      },
      onSubmit,
      componentProps: defaultComponentPropsWithStaticOption,
    }

    renderComponent(updatedProps)
    await userEvent.click(elements.autoComplete())
    await userEvent.click(screen.getByTitle('Clear'))
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          field_name: [defaultComponentPropsWithStaticOption.options[2]],
        },
        expect.anything()
      )
    )
  })
})
