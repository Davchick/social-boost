import { useMemo, useState } from 'react'
import { sortOrders, toggleOrdersSort } from '@/utils/sortOrders'

export function useOrdersSort(orders, defaultSort = 'date-desc') {
  const [sortBy, setSortBy] = useState(defaultSort)

  const sorted = useMemo(() => sortOrders(orders, sortBy), [orders, sortBy])

  function toggleSort(column) {
    setSortBy((prev) => toggleOrdersSort(prev, column))
  }

  return { sortBy, toggleSort, sorted }
}
