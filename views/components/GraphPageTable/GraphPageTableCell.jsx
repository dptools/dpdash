import * as React from 'react'
import TableCell from '@material-ui/core/TableCell'

const GraphPageTableCell = (props) => {
  return (
    <TableCell id={props.id} title={props.title}>
      {props.children}
    </TableCell>
  )
}

export default GraphPageTableCell
