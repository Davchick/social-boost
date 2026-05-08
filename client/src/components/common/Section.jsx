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
    gradient: 'bg-gradient-to-b from-primary to-tertiary',
  }

  return (
    <section 
      ref={ref}
      className={cn(
        'py-14 md:py-20 lg:py-24 relative',
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
        'mb-10 md:mb-12',
        centered && 'text-center',
        className
      )}
    >
      {badge && (
        <div 
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary mb-5',
            'opacity-0',
            isVisible && 'animate-slide-down'
          )}
        >
          <span className="text-sm text-text-secondary">{badge}</span>
        </div>
      )}
      
      <h2 
        className={cn(
          'text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary',
          'opacity-0',
          isVisible && 'animate-slide-up'
        )}
      >
        {title}
      </h2>
      
      {subtitle && (
        <p 
          className={cn(
            'mt-3 md:mt-4 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed',
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
