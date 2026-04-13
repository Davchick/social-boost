import { cn } from '@/utils/cn'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className,
  disabled,
  loading,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-transparent text-accent border border-accent hover:bg-accent/5 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent text-text-primary hover:bg-secondary',
  }

  const sizes = {
    default: 'px-8 py-4 text-base rounded-pill',
    small: 'px-5 py-2.5 text-sm rounded-pill',
    large: 'px-10 py-5 text-lg rounded-pill',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Загрузка...
        </span>
      ) : children}
    </button>
  )
}
