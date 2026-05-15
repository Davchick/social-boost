import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export function TablePagination({
  page,
  totalPages,
  onPageChange,
  rangeFrom,
  rangeTo,
  totalItems,
  className,
}) {
  if (totalItems === 0) return null

  const pages = buildPageNumbers(page, totalPages)

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border mt-4', className)}>
      <p className="text-sm text-text-secondary order-2 sm:order-1">
        Показано {rangeFrom}–{rangeTo} из {totalItems}
      </p>
      <nav className="flex items-center gap-1 order-1 sm:order-2" aria-label="Пагинация таблицы">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-tertiary disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((item, index) =>
          item === '…' ? (
            <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                'min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
                item === page
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-tertiary',
              )}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-tertiary disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Следующая страница"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('…')
    }
    result.push(sorted[i])
  }
  return result
}
