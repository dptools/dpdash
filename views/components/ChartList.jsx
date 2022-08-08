import React, { useEffect, useState } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import PlaylistAdd from '@material-ui/icons/PlaylistAdd'

import { getCharts, deleteChart, duplicateChart } from '../fe-utils/fetchUtil'

import { routes } from '../routes/routes'

const ChartList = () => {
  const [chartList, setChartList] = useState([])

  useEffect(() => {
    getCharts().then((res) => setChartList(res.data))
  }, [])

  const removeChart = async (id) => {
    try {
      const deleted = await deleteChart(id)

      if (deleted.data > 0) {
        await getCharts().then(({ data }) => {
          setChartList(data)
        })
      }
    } catch (error) {}
  }
  const onDuplicateChart = async (id) => {
    try {
      const duplicated = await duplicateChart(id)
      if (duplicated?.data) {
        await getCharts().then(({ data }) => {
          setChartList(data)
        })
      }
    } catch (error) {
      console.error(error, '*****')
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align='center'>Title</TableCell>
          <TableCell align='center'>Description</TableCell>
          <TableCell align='center'>Duplicate</TableCell>
          <TableCell align='center'>Edit</TableCell>
          <TableCell align='center'>Delete</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {chartList.map(({ title, description, _id }) => (
          <TableRow key={_id}>
            <TableCell align='center'>
              <Link color='textPrimary' href={routes.chart(_id)}>
                {title?.toUpperCase()}
              </Link>
            </TableCell>
            <TableCell align='center'>{description?.toUpperCase()}</TableCell>
            <TableCell align='center'>
              <Button
                type='button'
                variant='text'
                onClick={() => onDuplicateChart(_id)}
              >
                <PlaylistAdd />
              </Button>
            </TableCell>
            <TableCell align='center'>
              <Link href={routes.editChart(_id)} color='textPrimary'>
                <Edit />
              </Link>
            </TableCell>
            <TableCell align='center'>
              <Button
                type='button'
                variant='text'
                onClick={() => removeChart(_id)}
              >
                <Delete />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ChartList
