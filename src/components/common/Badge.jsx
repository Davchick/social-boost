import { cn } from '@/utils/cn'

export function Badge({ 
  children, 
  variant = 'default',
  className,
  ...props 
}) {
  const variants = {
    default: 'bg-tertiary text-text-secondary border-border',
    success: 'bg-success/10 text-success border-success/20',
    error: 'bg-error/10 text-error border-error/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    gradient: 'bg-gradient-to-r from-accent/10 to-accent-secondary/10 text-text-primary border-accent/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const statusConfig = {
    new: { label: 'Новый', variant: 'accent' },
    'in-progress': { label: 'В работе', variant: 'warning' },
    completed: { label: 'Завершён', variant: 'success' },
    cancelled: { label: 'Отменён', variant: 'error' },
  }

  const config = statusConfig[status] || statusConfig.new

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
