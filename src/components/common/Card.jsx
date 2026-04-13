import { cn } from '@/utils/cn'

export function Card({ 
  children, 
  className,
  hover = true,
  gradient = false,
  ...props 
}) {
  return (
    <div
      className={cn(
        'relative rounded-3xl bg-secondary border border-border p-6',
        hover && 'transition-all duration-500 hover:border-accent/30 hover:-translate-y-1 hover:shadow-glow',
        gradient && 'gradient-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-xl font-bold text-text-primary', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-text-secondary mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border', className)} {...props}>
      {children}
    </div>
  )
}
