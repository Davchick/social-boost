import { cn } from '@/utils/cn'

export function Container({ children, className, ...props }) {
  return (
    <div 
      className={cn('max-w-container mx-auto px-6 md:px-12', className)} 
      {...props}
    >
      {children}
    </div>
  )
}
