import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ConfigForm from '.'
import { colorList } from '../../fe-utils/colorList'
import { UserConfigModel } from '../../models'

describe('ConfigForm', () => {
  const defaultProps = {
    colors: colorList(),
    friendsList: [
      { label: 'user 1', value: 'user 1' },
      { label: 'user 2', value: 'user 2' },
    ],
    initialValues: UserConfigModel.defaultFormValues({
      readers: [],
      owner: 'user 1',
    }),
    handleClearAssessments: () => {},
    handleAssessmentSearch: () => {},
    handleSubmitDraft: () => {},
    onSubmit: () => {},
  }
  const elements = {
    configNameInput: () =>
      screen.getByRole('textbox', { name: 'Configuration name' }),
    description: () =>
      screen.getByRole('textbox', { name: 'Description (Optional)' }),
    submitAsDraft: () => screen.getByText('Save as draft'),
    publishConfig: () => screen.getByText('Publish'),
    makePublic: () => screen.getByRole('checkbox', { name: 'public' }),
  }
  const renderForm = (props = defaultProps) => {
    return render(<ConfigForm {...props} />)
  }

  it('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.configNameInput(), 'my config')
    await user.type(elements.description(), 'description')
    await user.click(elements.makePublic())

    await user.click(elements.publishConfig())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          config: [],
          configName: 'my config',
          configType: 'matrix',
          description: 'description',
          owner: 'user 1',
          public: true,
          readers: [],
        },
        expect.anything()
      )
    )
  })
  it('calls the save as draft prop when the form is saved as a draft configuration', async () => {
    const user = userEvent.setup()
    const handleSubmitDraft = jest.fn()
    const props = { ...defaultProps, handleSubmitDraft }

    renderForm(props)
    await user.type(elements.configNameInput(), 'draft config')
    await user.type(elements.description(), 'draft')
    await user.click(elements.submitAsDraft())

    await waitFor(() =>
      expect(handleSubmitDraft).toHaveBeenCalledWith(
        {
          config: [],
          configName: 'draft config',
          configType: 'matrix',
          description: 'draft',
          owner: 'user 1',
          public: false,
          readers: [],
        },
        expect.anything()
      )
    )
  })
})
