import React from 'react'
import { Paper, Button } from '@mui/material'
import { SaveAlt } from '@mui/icons-material'
import Table from '../../tables/Table'
import { SORT_DIRECTION } from '../../../constants'

import './GraphTable.css'

const GraphTable = ({
  graph,
  onGetCsv,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onSort,
  rowCount,
  tableColumns,
  tableRows,
  sortBy,
  sortDirection,
}) => {
  if (!graph) return null

  const cellRenderer = (site, property) => site[property]

  const handleRequestSort = (_event, property) => {
    const isAsc = sortDirection === SORT_DIRECTION.ASC

    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }

  return (
    <Paper sx={{ mt: '60px' }}>
      <div className="GraphTable_Top">
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={() => onGetCsv(graph.chart_id, graph.filters, graph.title)}
          size="medium"
          startIcon={<SaveAlt />}
        >
          Export as .csv
        </Button>
      </div>
      <Table
        cellRenderer={cellRenderer}
        handleRequestSort={handleRequestSort}
        data={tableRows}
        paginationCount={rowCount}
        page={page}
        rowsPerPage={rowsPerPage}
        headers={tableColumns}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        paginate
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  )
}

export default GraphTable
