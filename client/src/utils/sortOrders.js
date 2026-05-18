function parseBudget(value) {
  if (!value) return 0
  const num = parseInt(String(value).replace(/\D/g, ''), 10)
  return Number.isNaN(num) ? 0 : num
}

function parseOrderDate(order) {
  if (order.createdAtRaw) {
    return new Date(order.createdAtRaw).getTime()
  }
  if (!order.createdAt) return 0
  const [day, month, year] = order.createdAt.split('.').map(Number)
  return new Date(year, (month || 1) - 1, day).getTime()
}

export function sortOrders(orders, sortBy) {
  const [key, direction] = (sortBy ?? 'date-desc').split('-')
  const mult = direction === 'asc' ? 1 : -1
  const sorted = [...orders]

  sorted.sort((a, b) => {
    switch (key) {
      case 'budget':
        return mult * (parseBudget(a.budget) - parseBudget(b.budget))
      case 'date':
      default:
        return mult * (parseOrderDate(a) - parseOrderDate(b))
    }
  })

  return sorted
}

export function toggleOrdersSort(prev, column) {
  const [key, dir] = (prev ?? 'date-desc').split('-')
  if (key === column) {
    return `${column}-${dir === 'asc' ? 'desc' : 'asc'}`
  }
  return `${column}-desc`
}
