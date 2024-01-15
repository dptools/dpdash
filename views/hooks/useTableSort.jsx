import React, { useState } from 'react'
import { SORT_DIRECTION } from '../../constants'

export default function useTableSort(initialSortBy) {
  const [sortDirection, setDirection] = useState(SORT_DIRECTION.ASC)
  const [sortBy, setSortBy] = useState(initialSortBy)

  const onSort = (newSortBy, newSortDirection) => {
    setSortBy(newSortBy)
    setDirection(newSortDirection)
  }

  return {
    onSort,
    sortDirection,
    sortBy,
  }
}
