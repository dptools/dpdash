import * as React from 'react'
import TableCell from '@mui/material/TableCell'

const GraphPageTableCell = (props) => {
  return (
    <TableCell id={props.id} title={props.title}>
      {props.children}
    </TableCell>
  )
}

export default GraphPageTableCell
