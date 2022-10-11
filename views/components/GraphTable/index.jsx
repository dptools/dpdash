import React from 'react'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
} from '@material-ui/core'
import {
  graphTableRowDataBySite,
  formatGraphTableCellData,
  graphTableColumns,
} from './helpers'

const GraphTable = ({ graph }) => {
  if (!graph) return null

  const tableColumns = graphTableColumns(graph.labels)
  const tableRows = graphTableRowDataBySite(graph.dataBySite)

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Site</TableCell>
            {tableColumns.map(({ name }) => (
              <TableCell align="center" key={name}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((site) => {
            return (
              <TableRow hover key={site.name}>
                <TableCell align="center">{site.name}</TableCell>
                {tableColumns.map((column) => {
                  const { name: columnLabel, color } = column
                  const {
                    counts: { [columnLabel]: siteCount },
                    targets: { [columnLabel]: siteTarget },
                  } = site
                  return (
                    <TableCell
                      align="center"
                      style={{ color }}
                      key={columnLabel}
                    >
                      {formatGraphTableCellData(siteCount, siteTarget)}
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
