import React, { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { SORT_DIRECTION } from '../../../constants'
import api from '../../api'
import PageHeader from '../../components/PageHeader'
import useTableSort from '../../hooks/useTableSort'
import StudiesTable from '../../tables/StudiesTable'

const siteName = 'siteName'
const study = 'study'

const StudiesPage = () => {
  const [studies, setStudies] = useState([])
  const { onSort, sortDirection, sortBy } = useTableSort(study)
  const loadStudies = async () => {
    const sortParams = {
      ...(sortBy ? { sortBy: sortBy === siteName ? study : sortBy } : {}),
      ...(sortDirection ? { sortDirection } : {}),
    }
    const data = await api.userStudies.loadAll({ sort: sortParams })

    setStudies(data)
  }
  const handleRequestSort = (_event, property) => {
    const isAsc = sortDirection === SORT_DIRECTION.ASC

    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }

  useEffect(() => {
    loadStudies()
  }, [sortBy, sortDirection])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Studies" />
      <StudiesTable
        studies={studies}
        onSort={handleRequestSort}
        sortDirection={sortDirection}
        sortProperty={sortBy}
        sortable
      />
    </Box>
  )
}

export default StudiesPage
