import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import ChartsTable from '.'
import { createChart, createUser } from '../../../test/fixtures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { routes } from '../../routes/routes'
import { DATE_FORMAT } from '../../../constants'

describe(ChartsTable, () => {
  const user = createUser({ uid: 'user', favoriteCharts: ['2'] })

  const charts = [
    createChart({
      title: 'third chart',
      updatedAt: '2022-10-11T16:33:46.485Z',
      owner: 'bar',
      chartOwner: {
        display_name: 'Jack Jackson',
      },
      favorite: true,
    }),
    createChart({
      title: 'first chart',
      updatedAt: '2023-06-28T15:43:23.789Z',
      owner: user.uid,
      chartOwner: { display_name: 'John Johnson' },
      favorite: false,
    }),
    createChart({
      title: 'second chart',
      updatedAt: '2022-11-10T00:01:04.713Z',
      owner: 'foo',
      chartOwner: {
        display_name: 'Jane Janeson',
      },
      favorite: false,
    }),
  ]
  const defaultProps = {
    charts,
    onDelete: () => {},
    onDuplicate: () => {},
    onShare: () => {},
    onFavorite: () => {},
    user,
  }
  const renderChart = (props = defaultProps) =>
    render(
      <MemoryRouter>
        <ChartsTable {...props} />
      </MemoryRouter>
    )
  const elements = {
    editLink: () => screen.getByTestId('edit'),
    deleteBtn: () => screen.getByText('Delete'),
    duplicateBtn: () => screen.getByText('Duplicate'),
    shareBtn: () => screen.getByText('Share'),
    favoriteCheckbox: (chart) =>
      screen.getByRole('checkbox', { name: chart._id }),
    tableRow: (tableRow) => screen.getByTestId(`row-${tableRow}`),
  }
  const actions = {
    openTableRowMenu: async (chart) =>
      await userEvent.click(screen.getByTestId(chart._id)),
    deleteChart: async (chart) => {
      await actions.openTableRowMenu(chart)
      await userEvent.click(elements.deleteBtn())
    },
    duplicateChart: async (chart) => {
      await actions.openTableRowMenu(chart)
      await userEvent.click(elements.duplicateBtn())
    },
    shareChart: async (chart) => {
      await actions.openTableRowMenu(chart)
      await userEvent.click(elements.shareBtn())
    },
    favoriteChart: async () => {
      await userEvent.click(elements.tableRow(2)).getByRole('checkbox')
    },
  }

  it('renders charts', () => {
    renderChart()

    expect(
      within(elements.tableRow(0)).getByText(charts[0].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText(charts[0].chartOwner.display_name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText(
        dayjs(charts[0].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()
    expect(within(elements.tableRow(0)).getByRole('checkbox')).toBeChecked()

    expect(
      within(elements.tableRow(1)).getByText(charts[1].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(1)).getByText(charts[1].chartOwner.display_name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(1)).getByText(
        dayjs(charts[1].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()
    expect(within(elements.tableRow(1)).getByRole('checkbox')).not.toBeChecked()

    expect(
      within(elements.tableRow(2)).getByText(charts[2].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(2)).getByText(charts[2].chartOwner.display_name)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(2)).getByText(
        dayjs(charts[2].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()
    expect(within(elements.tableRow(2)).getByRole('checkbox')).not.toBeChecked()
  })

  it('renders a menu of chart actions', async () => {
    renderChart()

    await actions.openTableRowMenu(charts[1])

    expect(elements.editLink()).toHaveAttribute(
      'href',
      routes.editChart(charts[1]._id)
    )
    expect(elements.deleteBtn()).toBeInTheDocument()
    expect(elements.duplicateBtn()).toBeInTheDocument()
    expect(elements.shareBtn()).toBeInTheDocument()
  })

  describe('when the user is the chart owner', () => {
    it('calls the onDelete prop when "delete" is clicked', async () => {
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderChart(props)
      await actions.deleteChart(charts[1])

      expect(props.onDelete).toHaveBeenCalledWith(charts[1])
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderChart(props)
      await actions.duplicateChart(charts[1])

      expect(props.onDuplicate).toHaveBeenCalledWith(charts[1])
    })

    it('calls the onShare prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onShare: jest.fn() }

      renderChart(props)
      await actions.shareChart(charts[0])

      expect(props.onShare).toHaveBeenCalledWith(charts[0])
    })
  })

  describe('when the user is not the chart owner', () => {
    it('does not call the onDelete prop when "delete" is clicked', async () => {
      expect.assertions(1)
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderChart(props)

      try {
        await actions.deleteChart(charts[0])
      } catch {
        expect(props.onDelete).not.toHaveBeenCalled()
      }
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderChart(props)
      await actions.duplicateChart(charts[1])

      expect(props.onDuplicate).toHaveBeenCalledWith(charts[1])
    })

    it('calls the onShare prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onShare: jest.fn() }

      renderChart(props)
      await actions.shareChart(charts[1])

      expect(props.onShare).toHaveBeenCalledWith(charts[1])
    })
  })
  describe('when user favorites a chart', () => {
    it('calls the onFavorite prop when star icon is clicked', async () => {
      const props = { ...defaultProps, onFavorite: jest.fn() }

      renderChart(props)
      await userEvent.click(within(elements.tableRow(2)).getByRole('checkbox'))

      expect(props.onFavorite).toHaveBeenCalledWith(charts[2])
    })
  })
})
