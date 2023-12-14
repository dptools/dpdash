import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import GraphPageTableCell from './GraphPageTableCell'

const GraphPageTable = (props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <GraphPageTableCell theme={props.theme}> Label </GraphPageTableCell>
          <GraphPageTableCell theme={props.theme}> Min </GraphPageTableCell>
          <GraphPageTableCell theme={props.theme}> Max </GraphPageTableCell>
          <GraphPageTableCell theme={props.theme}> Mean </GraphPageTableCell>
          <GraphPageTableCell theme={props.theme}>Missing %</GraphPageTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.matrixData.map((data, idx) => {
          const validData = data.data.filter(
            (assessmentData) =>
              typeof assessmentData[data.variable] === 'number'
          )
          const missingDataPercentage =
            100 - (validData.length * 100) / props.maxDay
          const dataStat = data.stat[0]

          return (
            <TableRow key={idx}>
              <GraphPageTableCell theme={props.theme}>
                {data.label}
              </GraphPageTableCell>
              <GraphPageTableCell theme={props.theme}>
                {!isNaN(parseFloat(dataStat?.min)) && isFinite(dataStat.min)
                  ? dataStat.min.toFixed(2)
                  : 'N/A'}
              </GraphPageTableCell>
              <GraphPageTableCell theme={props.theme}>
                {!isNaN(parseFloat(dataStat?.max)) && isFinite(dataStat.max)
                  ? dataStat.max.toFixed(2)
                  : 'N/A'}
              </GraphPageTableCell>
              <GraphPageTableCell theme={props.theme}>
                {!isNaN(parseFloat(dataStat?.mean)) && isFinite(dataStat.mean)
                  ? dataStat.mean.toFixed(2)
                  : 'N/A'}
              </GraphPageTableCell>
              <GraphPageTableCell
                id={'stat-missingdata-' + idx}
                title={validData.length + '/' + props.maxDay}
                theme={props.theme}
              >
                {`${missingDataPercentage.toFixed(2)} (${validData.length}/${
                  props.maxDay
                })`}
              </GraphPageTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default GraphPageTable
