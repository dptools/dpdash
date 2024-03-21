import React from 'react'
import {
  TableCell,
  TableHead as MuiTableHead,
  TableRow,
  Box,
  TableSortLabel,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'

import { SORT_DIRECTION, fontSize } from '../../../constants'

function TableHead(props) {
  const { sortDirection, sortProperty, onRequestSort, headCells } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <MuiTableHead>
      <TableRow>
        {headCells.map((headCell) => {
          const cellIsActive = sortProperty === headCell.dataProperty
          const activeSortDirection = cellIsActive
            ? sortDirection?.toLowerCase()
            : undefined

          return (
            <TableCell
              key={headCell.dataProperty}
              sortDirection={activeSortDirection}
              sx={{ border: 0, fontSize: fontSize[12], fontWeight: 400 }}
            >
              {headCell.sortable ? (
                <TableSortLabel
                  active={cellIsActive}
                  direction={activeSortDirection}
                  onClick={createSortHandler(headCell.dataProperty)}
                >
                  {headCell.label}
                  {cellIsActive ? (
                    <Box component="span" sx={visuallyHidden}>
                      {sortDirection === SORT_DIRECTION.DESC
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          )
        })}
      </TableRow>
    </MuiTableHead>
  )
}

export default TableHead
