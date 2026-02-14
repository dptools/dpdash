import React from 'react'

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ChartShareForm from '.'
import { createChart } from '../../../test/fixtures'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useController: () => jest.fn().mockReturnValue({ field: {} }),
  control: {},
}))

beforeEach(() => {
  jest.resetAllMocks()
})
describe(ChartShareForm, () => {
  const defaultProps = {
    chartToShare: {},
    closeDialog: jest.fn(),
    shareWithUsers: jest.fn(),
    sharedWithOptions: [],
    shareFormControl: jest.fn().mockReturnValue({ field: {} }),
    shareFormValues: {
      sharedWith: [],
    },
    clearSelectedUsers: jest.fn(),
    selectAllUsers: jest.fn(),
  }

  const elements = {
    dialogs: () => screen.queryAllByRole('dialog'),
    dialog: () => screen.findByRole('dialog'),
    combobox: () => screen.getByRole('combobox'),
    checkbox: async () => {
      const checkboxes = await screen.findAllByRole('checkbox')
      return checkboxes[0]
    },
    submitButton: () => screen.getByTestId('submit'),
    cancelButton: () => screen.getByTestId('cancel'),
    clearButton: () => screen.getByRole('button', { name: 'CLEAR' }),
    selectAllButton: () => screen.getByRole('button', { name: 'SELECT ALL' }),
  }

  describe('when the chart to share is empty', () => {
    it('does not show the dialog', async () => {
      render(<ChartShareForm {...defaultProps} />)

      expect(await elements.dialogs()).toEqual([])
    })
  })

  describe('when the chart to share is populated', () => {
    const chartToShare = createChart()
    const selectedUser = {
      value: 'alice',
      label: 'Alice',
    }

    const sharedWithOptions = [
      selectedUser,
      { value: 'bob', label: 'Bob' },
      { value: 'cody', label: 'Cody' },
    ]
    it('shows the dialog', async () => {
      render(
        <ChartShareForm
          {...defaultProps}
          chartToShare={chartToShare}
          sharedWithOptions={sharedWithOptions}
        />
      )

      await waitFor(async () => {
        expect(await elements.dialog()).toBeInTheDocument()
      })
    })
    it('allows the user to select other users to share the chart with', async () => {
      render(
        <ChartShareForm
          {...defaultProps}
          chartToShare={chartToShare}
          sharedWithOptions={sharedWithOptions}
        />
      )

      await waitFor(async () =>
        expect(await elements.dialog()).toBeInTheDocument()
      )

      await userEvent.click(elements.combobox())

      await waitFor(async () => {
        expect(await elements.checkbox()).toBeInTheDocument()
      })

      await userEvent.click(await elements.checkbox())
      fireEvent.submit(await elements.submitButton())

      await waitFor(async () => {
        expect(defaultProps.shareWithUsers).toHaveBeenCalled()
      })
    })

    it('allows the user to clear all selected users', async () => {
      render(
        <ChartShareForm
          {...defaultProps}
          chartToShare={chartToShare}
          sharedWithOptions={sharedWithOptions}
        />
      )

      await waitFor(async () =>
        expect(await elements.dialog()).toBeInTheDocument()
      )

      await userEvent.click(elements.combobox())

      await waitFor(async () => {
        expect(await elements.checkbox()).toBeInTheDocument()
      })

      await userEvent.click(await elements.clearButton())

      await waitFor(async () => {
        expect(defaultProps.clearSelectedUsers).toHaveBeenCalled()
      })
    })
    it('allows the user to select all users', async () => {
      render(
        <ChartShareForm
          {...defaultProps}
          chartToShare={chartToShare}
          sharedWithOptions={sharedWithOptions}
        />
      )

      await waitFor(async () =>
        expect(await elements.dialog()).toBeInTheDocument()
      )

      await userEvent.click(elements.combobox())

      await waitFor(async () => {
        expect(await elements.checkbox()).toBeInTheDocument()
      })

      await userEvent.click(await elements.selectAllButton())

      await waitFor(async () => {
        expect(defaultProps.selectAllUsers).toHaveBeenCalled()
      })
    })
  })
})
