import { useState, useEffect } from 'react'
import { baseGridWidth, baseInnerWidth } from '../../constants'

function useGrid() {
  const [gridState, setGridState] = useState({
    columns: null,
    gridWidth: baseGridWidth,
  })

  const handleResize = () => {
    if (window.innerWidth >= baseInnerWidth) {
      const columns = Math.floor(window.innerWidth / gridState.gridWidth)
      const gridWidth = window.innerWidth / columns
      setGridState({ columns, gridWidth })
    } else if (gridState.columns !== 1) {
      setGridState({ columns: 1, gridWidth: baseGridWidth })
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return gridState
}

export default useGrid
