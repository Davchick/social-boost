const MS_DAY = 24 * 60 * 60 * 1000

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDayLabel(date) {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/** @param {{ createdAtRaw?: string | Date }[]} items */
export function buildDailySeries(items, days = 14) {
  const today = startOfDay(new Date())
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getTime() - (days - 1 - index) * MS_DAY)
    return { date, label: formatDayLabel(date), count: 0 }
  })

  for (const item of items) {
    if (!item?.createdAtRaw) continue
    const created = startOfDay(new Date(item.createdAtRaw))
    const diffDays = Math.round((today.getTime() - created.getTime()) / MS_DAY)
    if (diffDays < 0 || diffDays >= days) continue
    buckets[days - 1 - diffDays].count += 1
  }

  return buckets
}

const STATUS_LABELS = {
  new: 'Новые',
  'in-progress': 'В работе',
  completed: 'Завершённые',
  cancelled: 'Отменённые',
}

const STATUS_COLORS = {
  new: '#4F46E5',
  'in-progress': '#F59E0B',
  completed: '#10B981',
  cancelled: '#EF4444',
}

/** @param {{ status: string }[]} orders */
export function buildStatusDistribution(orders) {
  const counts = { new: 0, 'in-progress': 0, completed: 0, cancelled: 0 }
  for (const order of orders) {
    if (counts[order.status] !== undefined) counts[order.status] += 1
  }
  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      status,
      name: STATUS_LABELS[status] || status,
      value,
      fill: STATUS_COLORS[status] || '#64748B',
    }))
}

/** @param {{ service: string }[]} orders */
export function buildTopServices(orders, limit = 5) {
  const counts = new Map()
  for (const order of orders) {
    const key = order.service?.trim() || 'Без услуги'
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }))
}
