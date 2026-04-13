import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

export function Hero({ 
  title, 
  subtitle, 
  primaryCta, 
  secondaryCta,
  centered = true,
  background = 'white'
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section 
      ref={ref}
      className={cn(
        'py-20 md:py-32 lg:py-40',
        background === 'secondary' ? 'bg-secondary' : 'bg-white'
      )}
    >
      <Container>
        <div className={cn(
          'max-w-4xl',
          centered && 'mx-auto text-center'
        )}>
          <h1 
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-tight text-balance',
              'opacity-0 translate-y-5',
              isVisible && 'animate-fade-in'
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className={cn(
                'mt-6 text-lg md:text-xl text-text-secondary max-w-2xl text-pretty',
                centered && 'mx-auto',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in stagger-1'
              )}
            >
              {subtitle}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div 
              className={cn(
                'mt-10 flex flex-col sm:flex-row gap-4',
                centered && 'justify-center',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in stagger-2'
              )}
            >
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button size="large">{primaryCta.label}</Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.href}>
                  <Button variant="secondary" size="large">{secondaryCta.label}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
