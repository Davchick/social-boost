import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export const Input = forwardRef(function Input({ 
  label, 
  error, 
  className,
  ...props 
}, ref) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3.5 rounded-xl border border-border bg-secondary text-text-primary',
          'placeholder:text-text-muted',
          'focus:outline-none focus:border-accent focus:bg-secondary/80',
          'transition-all duration-300',
          error && 'border-error focus:border-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})
