import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { Instagram, MessageCircle, Video, Sparkles } from 'lucide-react'

const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
  <div 
    className={cn(
      'absolute w-14 h-14 rounded-2xl flex items-center justify-center glass',
      'animate-float opacity-60',
      className
    )}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className="w-6 h-6 text-text-secondary" />
  </div>
)

export function Hero({ 
  title, 
  subtitle, 
  primaryCta, 
  secondaryCta,
  centered = true,
  showFloatingIcons = true
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center py-20 md:py-32 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-primary">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-tertiary/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating social icons */}
      {showFloatingIcons && (
        <>
          <FloatingIcon icon={Instagram} className="top-[20%] left-[10%] hidden lg:flex" delay={0} />
          <FloatingIcon icon={MessageCircle} className="top-[30%] right-[15%] hidden lg:flex" delay={1} />
          <FloatingIcon icon={Video} className="bottom-[30%] left-[15%] hidden lg:flex" delay={2} />
          <FloatingIcon icon={Sparkles} className="bottom-[25%] right-[10%] hidden lg:flex" delay={3} />
        </>
      )}

      <Container className="relative z-10">
        <div className={cn(
          'max-w-5xl',
          centered && 'mx-auto text-center'
        )}>
          {/* Badge */}
          <div 
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8',
              'opacity-0',
              isVisible && 'animate-slide-down'
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm text-text-secondary">SMM-агентство нового поколения</span>
          </div>

          <h1 
            className={cn(
              'text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight',
              'opacity-0',
              isVisible && 'animate-slide-up'
            )}
          >
            <span className="text-text-primary">{title.split(' ').slice(0, -2).join(' ')}</span>
            {' '}
            <span className="gradient-text">{title.split(' ').slice(-2).join(' ')}</span>
          </h1>

          {subtitle && (
            <p 
              className={cn(
                'mt-8 text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl leading-relaxed',
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
                'mt-12 flex flex-col sm:flex-row gap-4',
                centered && 'justify-center',
                'opacity-0',
                isVisible && 'animate-slide-up stagger-2'
              )}
            >
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button size="large" className="group">
                    {primaryCta.label}
                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.href}>
                  <Button variant="secondary" size="large">{secondaryCta.label}</Button>
                </Link>
              )}
            </div>
          )}

          {/* Stats row */}
          <div 
            className={cn(
              'mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto',
              'opacity-0',
              isVisible && 'animate-slide-up stagger-3'
            )}
          >
            {[
              { value: '150+', label: 'Клиентов' },
              { value: '5M+', label: 'Охват в месяц' },
              { value: '300%', label: 'Средний ROI' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
    </section>
  )
}
