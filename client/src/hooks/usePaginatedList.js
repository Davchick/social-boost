import { useEffect, useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 10

export function usePaginatedList(items, pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const rangeFrom = items.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeTo = Math.min(page * pageSize, items.length)

  return {
    page,
    setPage,
    pageItems,
    totalPages,
    pageSize,
    rangeFrom,
    rangeTo,
    totalItems: items.length,
  }
}
