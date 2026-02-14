import React from 'react'

import { render, screen, within } from '@testing-library/react'

import StudiesTable from '.'
import { SITE_NAMES } from '../../../server/utils/siteNames'
import { createStudyTableRowData } from '../../../test/fixtures'

describe(StudiesTable, () => {
  const studies = [
    createStudyTableRowData({
      daysInStudy: 655,
      numOfParticipants: 2,
      study: 'LA',
      updatedAt: '2024-01-05T06:00:00.000Z',
    }),
    createStudyTableRowData({
      daysInStudy: 1005,
      numOfParticipants: 2,
      study: 'MA',
      updatedAt: '2024-01-05T06:00:00.000Z',
    }),
    createStudyTableRowData({
      daysInStudy: 105,
      numOfParticipants: 2,
      study: 'YA',
      updatedAt: '2024-01-05T06:00:00.000Z',
    }),
  ]
  const defaultProps = {
    studies,
    onDelete: () => {},
    onDuplicate: () => {},
    onShare: () => {},
    onFavorite: () => {},
  }
  const tableRow = (rowNum) => screen.getByTestId(`row-${rowNum}`)
  const renderTable = (props = defaultProps) =>
    render(<StudiesTable {...props} />)

  it('renders the studies table', () => {
    renderTable()

    expect(within(tableRow(0)).getByText(studies[0].study)).toBeInTheDocument()
    expect(
      within(tableRow(0)).getByText(SITE_NAMES[studies[0].study])
    ).toBeInTheDocument()
    expect(
      within(tableRow(0)).getByText(studies[0].daysInStudy)
    ).toBeInTheDocument()
    expect(
      within(tableRow(0)).getByText(studies[0].numOfParticipants)
    ).toBeInTheDocument()
    expect(
      within(tableRow(0)).getByText(studies[0].updatedAt)
    ).toBeInTheDocument()
    expect(within(tableRow(1)).getByText(studies[1].study)).toBeInTheDocument()
    expect(
      within(tableRow(1)).getByText(SITE_NAMES[studies[1].study])
    ).toBeInTheDocument()
    expect(
      within(tableRow(1)).getByText(studies[1].daysInStudy)
    ).toBeInTheDocument()
    expect(
      within(tableRow(1)).getByText(studies[1].numOfParticipants)
    ).toBeInTheDocument()
    expect(
      within(tableRow(1)).getByText(studies[1].updatedAt)
    ).toBeInTheDocument()
    expect(within(tableRow(2)).getByText(studies[2].study)).toBeInTheDocument()
    expect(
      within(tableRow(2)).getByText(SITE_NAMES[studies[2].study])
    ).toBeInTheDocument()
    expect(
      within(tableRow(2)).getByText(studies[2].daysInStudy)
    ).toBeInTheDocument()
    expect(
      within(tableRow(2)).getByText(studies[2].numOfParticipants)
    ).toBeInTheDocument()
    expect(
      within(tableRow(2)).getByText(studies[2].updatedAt)
    ).toBeInTheDocument()
  })
})
