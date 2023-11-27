import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfigurationsTable from '.'
import { createUser, createConfiguration } from '../../../test/fixtures'

describe('ConfigurationsTable', () => {
  const user = createUser({ uid: 'user', preferences: { config: '1' } })
  const configurations = [
    createConfiguration({
      name: 'config1',
      owner: user.uid,
      readers: ['user', 'foo', 'bar'],
    }),
    createConfiguration({
      _id: '2',
      name: 'config2',
      owner: 'foo',
      readers: ['foo'],
    }),
    createConfiguration({
      _id: '3',
      name: 'config3',
      readers: ['user', 'bar'],
      owner: 'bar',
    }),
  ]
  const defaultProps = {
    configurations,
    onDefaultChange: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
    onEdit: () => {},
    onShare: () => {},
    user,
  }
  const elements = {
    editBtn: () => screen.getByTestId('EditIcon'),
    deleteBtn: () => screen.getByTestId('DeleteIcon'),
    duplicateBtn: () => screen.getByTestId('ContentCopyIcon'),
    shareBtn: () => screen.getByTestId('ShareIcon'),
    setDefaultBtn: () => screen.getByTestId('SettingsApplicationsIcon'),
    tableRow: (tableRow) => screen.getByTestId(`row-${tableRow}`),
  }
  const renderConfigurationsTable = (props = defaultProps) =>
    render(<ConfigurationsTable {...props} />)
  const actions = {
    openTableRowMenu: async (configuration) =>
      await userEvent.click(screen.getByTestId(configuration._id)),
    deleteConfiguration: async (configuration) => {
      await actions.openTableRowMenu(configuration)
      await userEvent.click(elements.deleteBtn())
    },
    duplicateConfiguration: async (configuration) => {
      await actions.openTableRowMenu(configuration)
      await userEvent.click(elements.duplicateBtn())
    },
    shareConfiguration: async (configuration) => {
      await actions.openTableRowMenu(configuration)
      await userEvent.click(elements.shareBtn())
    },
    setDefaultConfiguration: async (configuration) => {
      await actions.openTableRowMenu(configuration)
      await userEvent.click(elements.setDefaultBtn())
    },
  }

  it('renders chart', () => {
    renderConfigurationsTable()

    expect(
      within(elements.tableRow(0)).getByText(configurations[0].name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText(configurations[0].owner)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText('Default')
    ).toBeInTheDocument()

    expect(
      within(elements.tableRow(1)).getByText(configurations[1].name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(1)).getByText(configurations[1].owner)
    ).toBeInTheDocument()

    expect(
      within(elements.tableRow(2)).getByText(configurations[2].name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(2)).getByText(configurations[2].owner)
    ).toBeInTheDocument()
  })

  it('renders a menu of actions', async () => {
    renderConfigurationsTable()
    await actions.openTableRowMenu(configurations[0])

    expect(elements.editBtn()).toBeInTheDocument()
    expect(elements.deleteBtn()).toBeInTheDocument()
    expect(elements.duplicateBtn()).toBeInTheDocument()
    expect(elements.shareBtn()).toBeInTheDocument()
    expect(elements.setDefaultBtn()).toBeInTheDocument()
  })

  describe('when the user is the configuration owner', () => {
    it('calls the onDelete prop when "delete" is clicked', async () => {
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderConfigurationsTable(props)
      await actions.deleteConfiguration(configurations[0])

      expect(props.onDelete).toHaveBeenCalledWith(configurations[0]._id)
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderConfigurationsTable(props)
      await actions.duplicateConfiguration(configurations[0])

      expect(props.onDuplicate).toHaveBeenCalledWith(configurations[0])
    })

    it('calls the onShare prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onShare: jest.fn() }

      renderConfigurationsTable(props)
      await actions.shareConfiguration(configurations[0])

      expect(props.onShare).toHaveBeenCalledWith(configurations[0])
    })

    it('calls the onDefaultChange prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onDefaultChange: jest.fn() }

      renderConfigurationsTable(props)
      await actions.setDefaultConfiguration(configurations[0])

      expect(props.onDefaultChange).toHaveBeenCalledWith(configurations[0]._id)
    })
  })

  describe('when the user is not the configuration owner', () => {
    it('does not call the onDelete prop when "delete" is clicked', async () => {
      expect.assertions(1)
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderConfigurationsTable(props)

      try {
        await actions.deleteConfiguration(configurations[1])
      } catch {
        expect(props.onDelete).not.toHaveBeenCalled()
      }
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderConfigurationsTable(props)
      await actions.duplicateConfiguration(configurations[1])

      expect(props.onDuplicate).toHaveBeenCalledWith(configurations[1])
    })

    it('calls the onDefaultChange when "set as default" is clicked', async () => {
      const props = { ...defaultProps, onDefaultChange: jest.fn() }

      renderConfigurationsTable(props)
      await actions.setDefaultConfiguration(configurations[1])

      expect(props.onDefaultChange).toHaveBeenCalledWith(configurations[1]._id)
    })
  })
})
