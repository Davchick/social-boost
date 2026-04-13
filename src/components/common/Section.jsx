import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export const Section = forwardRef(function Section({ 
  children, 
  className,
  background = 'primary',
  ...props 
}, ref) {
  const backgrounds = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    gradient: 'bg-gradient-to-b from-primary to-secondary',
  }

  return (
    <section 
      ref={ref}
      className={cn(
        'py-20 md:py-28 lg:py-32 relative',
        backgrounds[background],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
})

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = true,
  badge,
  className 
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div 
      ref={ref}
      className={cn(
        'mb-12 md:mb-16',
        centered && 'text-center',
        className
      )}
    >
      {badge && (
        <div 
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6',
            'opacity-0',
            isVisible && 'animate-slide-down'
          )}
        >
          <span className="text-sm text-text-secondary">{badge}</span>
        </div>
      )}
      
      <h2 
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-bold',
          'opacity-0',
          isVisible && 'animate-slide-up'
        )}
      >
        <span className="gradient-text">{title}</span>
      </h2>
      
      {subtitle && (
        <p 
          className={cn(
            'mt-4 md:mt-6 text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed',
            centered && 'mx-auto',
            'opacity-0',
            isVisible && 'animate-slide-up stagger-1'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
