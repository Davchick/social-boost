import { cn } from '@/utils/cn'

export function Section({ 
  children, 
  className, 
  background = 'white',
  ...props 
}) {
  const backgrounds = {
    white: 'bg-white',
    secondary: 'bg-secondary',
  }

  return (
    <section 
      className={cn(
        'py-16 md:py-20 lg:py-24',
        backgrounds[background],
        className
      )} 
      {...props}
    >
      {children}
    </section>
  )
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = true,
  className,
  ...props 
}) {
  return (
    <div 
      className={cn(
        'mb-12 md:mb-16',
        centered && 'text-center',
        className
      )} 
      {...props}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  )
}
