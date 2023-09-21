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

const GraphTable = ({ graph, classes, onGetCsv }) => {
  if (!graph) return null

  const { tableColumns, tableRows } = graph.graphTable

  return (
    <Paper className={classes.graphTableContainer}>
      <Toolbar>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => onGetCsv(graph.chart_id, graph.filters, graph.title)}
        >
          <ArrowDropDownIcon className={classes.tableCsvIcon} />
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
