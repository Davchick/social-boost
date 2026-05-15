import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'
import { FIELD_INPUT_WITH_SUFFIX_CLASS, FIELD_LABEL_CLASS } from '@/utils/fieldStyles'

export const PasswordInput = forwardRef(function PasswordInput({
  label,
  error,
  className,
  ...props
}, ref) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className={FIELD_LABEL_CLASS}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn(
            FIELD_INPUT_WITH_SUFFIX_CLASS,
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})
