import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { FIELD_INPUT_CLASS, FIELD_LABEL_CLASS } from '@/utils/fieldStyles'

export const Input = forwardRef(function Input({ 
  label, 
  error, 
  className,
  ...props 
}, ref) {
  return (
    <div className="w-full">
      {label && (
        <label className={FIELD_LABEL_CLASS}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          FIELD_INPUT_CLASS,
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
