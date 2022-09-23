import React from 'react'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
} from '@material-ui/core'

const GraphTable = ({ graph }) => {
  if (!graph) return null

  const [totalsSite, ...sites] = graph.dataBySite
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Site</TableCell>
            {graph.labels.map(({ name }) => (
              <React.Fragment key={name + 'table-header'}>
                <TableCell align="center">{name}</TableCell>
                <TableCell align="center">{name}%</TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map((site) => {
            return (
              <TableRow hover key={site.name}>
                <TableCell align="center">{site.name}</TableCell>
                {graph.labels.map((fieldLabel) => (
                  <React.Fragment key={fieldLabel.name + 'table'}>
                    <TableCell
                      align="center"
                      style={{ color: fieldLabel.color }}
                    >
                      {site.counts[fieldLabel.name]}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: fieldLabel.color }}
                    >
                      {site.percentages[fieldLabel.name].toFixed(0)}%
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            )
          })}
          <TableRow hover>
            <TableCell align="center">{totalsSite.name}</TableCell>
            {graph.labels.map((fieldLabel) => (
              <React.Fragment key={fieldLabel.name + 'totals'}>
                <TableCell align="center">
                  {totalsSite.counts[fieldLabel.name]}
                </TableCell>
                <TableCell align="center">
                  {totalsSite.percentages[fieldLabel.name].toFixed(0)}%
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

export default GraphTable
