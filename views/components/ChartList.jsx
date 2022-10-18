import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Share from '@material-ui/icons/Share'
import PlaylistAdd from '@material-ui/icons/PlaylistAdd'

import { routes } from '../routes/routes'

const ChartList = ({
  handleShareChart,
  chartList,
  removeChart,
  onDuplicateChart,
  user,
  classes,
}) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Chart</TableCell>
            <TableCell align="center">Duplicate</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Share</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chartList.map((chart) => {
            const userIsOwner = user.uid === chart.owner

            return (
              <TableRow key={chart._id}>
                <TableCell>
                  <Link color="textPrimary" href={routes.chart(chart._id)}>
                    {chart.title}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => onDuplicateChart(chart._id)}
                  >
                    <PlaylistAdd />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Link
                    href={userIsOwner ? routes.editChart(chart._id) : '#'}
                    color="textPrimary"
                    className={userIsOwner ? '' : classes.disable}
                  >
                    <Edit />
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => handleShareChart(chart)}
                  >
                    <Share />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    className={userIsOwner ? '' : classes.disable}
                    disabled={!userIsOwner}
                    type="button"
                    variant="text"
                    onClick={() => removeChart(chart._id)}
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default ChartList
