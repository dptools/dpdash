import { renderHook, act } from '@testing-library/react'
import useTableSort from './useTableSort'

describe('useTableSort', () => {
  it('returns an initial sort direction and sort property', () => {
    const { result } = renderHook(() => useTableSort('title'))

    expect(result.current.sortDirection).toBe('ASC')
    expect(result.current.sortBy).toBe('title')
  })
  it('updates the sort direction and property when onSort is called', () => {
    const { result } = renderHook(() => useTableSort('title'))
    act(() => {
      result.current.onSort('date', 'DESC')
    })

    expect(result.current.sortDirection).toBe('DESC')
    expect(result.current.sortBy).toBe('date')
  })
})
