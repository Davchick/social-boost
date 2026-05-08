import { cn } from '@/utils/cn'

export function Container({ children, className, ...props }) {
  return (
    <div 
      className={cn('max-w-container mx-auto px-4 sm:px-6 lg:px-10', className)} 
      {...props}
    >
      {children}
    </div>
  )
}
