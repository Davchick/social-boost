import { cn } from '@/utils/cn'

export const CHART_PERIOD_OPTIONS = [7, 14, 30, 90]

export function chartPeriodLabel(days) {
  return `${days} дн.`
}

export function ChartPeriodToggle({ value, onChange, className }) {
  return (
    <div
      role="group"
      aria-label="Период графика"
      className={cn('inline-flex flex-wrap gap-1 rounded-lg border border-border bg-tertiary/60 p-1', className)}
    >
      {CHART_PERIOD_OPTIONS.map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => onChange(days)}
          className={cn(
            'px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors',
            value === days
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-secondary',
          )}
        >
          {chartPeriodLabel(days)}
        </button>
      ))}
    </div>
  )
}
