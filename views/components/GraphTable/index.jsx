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
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { fetchGraphTableCSV } from '../../fe-utils/fetchUtil'

const GraphTable = ({ graph, classes }) => {
  if (!graph) return null

  const { tableColumns, tableRows } = graph.graphTable

  return (
    <Paper className={classes.graphTableContainer}>
      <Toolbar>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            fetchGraphTableCSV(
              graph.chart_id,
              { filters: graph.filters },
              graph.title
            )
          }
        >
          <ArrowDropDownIcon className={classes.tableCsvIcon} />
          Export as CSV
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(({ name }) => (
              <TableCell align="center" key={name}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row, index) => {
            return (
              <TableRow hover key={tableColumns[index] + index}>
                {row.map(({ data, color }, i) => {
                  return (
                    <TableCell align="center" style={{ color }} key={i}>
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
