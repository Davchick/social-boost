import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export const Textarea = forwardRef(function Textarea({ 
  label, 
  error, 
  className,
  rows = 4,
  ...props 
}, ref) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-text-secondary mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 rounded-12 border border-border bg-white text-text-primary',
          'placeholder:text-text-secondary/60',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'transition-all duration-200 resize-none',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})
