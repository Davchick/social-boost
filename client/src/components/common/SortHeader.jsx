import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export function SortHeader({ label, active, direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
    >
      {label}
      {active ? (
        direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
      )}
    </button>
  )
}

export function sortDirectionFor(sortBy, column) {
  const [key, dir] = (sortBy ?? '').split('-')
  return key === column ? dir : 'desc'
}

export function isSortActive(sortBy, column) {
  return (sortBy ?? '').startsWith(`${column}-`)
}
