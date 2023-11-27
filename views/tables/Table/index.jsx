import React from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'

import TableHead from './TableHead'

const firstCellStyles = (cellIndex) => {
  if (cellIndex !== 0) {
    return {}
  }

  return {
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: 'grey.100',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  }
}

const lastCellStyles = (cellIndex, headers) => {
  if (cellIndex !== headers.length - 1) {
    return {}
  }

  return {
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: 'grey.100',
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  }
}

const Table = (props) => {
  const {
    cellRenderer,
    data,
    headers,
    sortDirection,
    sortProperty,
    handleRequestSort,
  } = props

  return (
    <TableContainer>
      <MuiTable
        size="small"
        sx={{ border: 0, borderCollapse: 'separate', borderSpacing: '0 16px' }}
      >
        <TableHead
          sortDirection={sortDirection}
          sortProperty={sortProperty}
          onRequestSort={handleRequestSort}
          headCells={headers}
        />
        <TableBody>
          {data.map((rowData, rowIndex) => (
            <TableRow data-testid={`row-${rowIndex}`}>
              {headers.map((header, cellIndex) => (
                <TableCell
                  align={header.dataAlign}
                  key={header.dataProperty}
                  sx={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey.100',
                    borderBottomStyle: 'solid',
                    borderTopWidth: 1,
                    borderTopColor: 'grey.100',
                    borderTopStyle: 'solid',
                    typography: 'body1',
                    ...firstCellStyles(cellIndex),
                    ...lastCellStyles(cellIndex, headers),
                  }}
                >
                  {cellRenderer(rowData, header.dataProperty)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
