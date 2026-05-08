import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { ArrowRight } from 'lucide-react'

export function Hero({ 
  title, 
  subtitle, 
  primaryCta, 
  secondaryCta,
  centered = true
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section 
      ref={ref}
      className="relative flex items-center pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <Container className="relative z-10">
        <div className={cn(
          'max-w-4xl',
          centered && 'mx-auto text-center'
        )}>
          <div 
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary mb-6',
              'opacity-0',
              isVisible && 'animate-slide-down'
            )}
          >
            <span className="inline-flex rounded-full h-2 w-2 bg-accent"></span>
            <span className="text-sm text-text-secondary">SMM-агентство нового поколения</span>
          </div>

          <h1 
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-text-primary',
              'opacity-0',
              isVisible && 'animate-slide-up'
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <p 
              className={cn(
                'mt-5 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed',
                centered && 'mx-auto',
                'opacity-0',
                isVisible && 'animate-slide-up stagger-1'
              )}
            >
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div 
              className={cn(
                'mt-8 flex flex-col sm:flex-row gap-3',
                centered && 'justify-center',
                'opacity-0',
                isVisible && 'animate-slide-up stagger-2'
              )}
            >
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button size="large" className="group w-full sm:w-auto">
                    {primaryCta.label}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.href}>
                  <Button variant="secondary" size="large" className="w-full sm:w-auto">{secondaryCta.label}</Button>
                </Link>
              )}
            </div>
          )}

          <div 
            className={cn(
              'mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto',
              'opacity-0',
              isVisible && 'animate-slide-up stagger-3'
            )}
          >
            {[
              { value: '150+', label: 'Клиентов' },
              { value: '5M+', label: 'Охват в месяц' },
              { value: '300%', label: 'Средняя окупаемость' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-secondary border border-border rounded-xl py-4">
                <div className="text-xl md:text-2xl font-semibold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
