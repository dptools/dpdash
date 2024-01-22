import React from 'react'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
  Toolbar,
  Button,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const GraphTable = ({ graph, onGetCsv }) => {
  if (!graph) return null

  const { tableColumns, tableRows } = graph.graphTable

  return (
    <Paper>
      <Toolbar>
        <Button
          variant="outlined"
          onClick={() => onGetCsv(graph.chart_id, graph.filters, graph.title)}
        >
          <ArrowDropDownIcon />
          Export as CSV
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(({ name }, idx) => (
              <TableCell align="center" key={name + '-' + idx}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row, index) => {
            return (
              <TableRow hover key={tableColumns[index] + '-' + index}>
                {row.map(({ data, color }, i) => {
                  return (
                    <TableCell
                      align="center"
                      style={{ color }}
                      key={data + '-' + i + '-' + color}
                    >
                      {data}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default GraphTable
