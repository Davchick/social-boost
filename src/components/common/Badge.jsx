import { cn } from '@/utils/cn'

export function Badge({ 
  children, 
  variant = 'default',
  className,
  ...props 
}) {
  const variants = {
    default: 'bg-secondary text-text-secondary',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-yellow-100 text-yellow-800',
    accent: 'bg-accent/10 text-accent',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
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
