import { Link } from 'react-router-dom'
import { Instagram, Target, Video, Users, ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { services } from '@/data/services'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const iconMap = {
  Instagram,
  Target,
  Video,
  Users,
}

const gradientMap = {
  'smm': 'from-pink-500 to-rose-500',
  'targeted': 'from-violet-500 to-purple-500',
  'reels': 'from-cyan-500 to-blue-500',
  'influence': 'from-amber-500 to-orange-500',
}

const glowMap = {
  'smm': 'group-hover:shadow-glow-pink',
  'targeted': 'group-hover:shadow-glow',
  'reels': 'group-hover:shadow-glow-cyan',
  'influence': 'group-hover:shadow-glow',
}

export function ServicesGrid({ limit, showHeader = true, title, subtitle }) {
  const { ref, isVisible } = useScrollAnimation()
  const displayServices = limit ? services.slice(0, limit) : services

  return (
    <Section ref={ref}>
      <Container>
        {showHeader && (
          <SectionHeader 
            title={title || 'Наши услуги'} 
            subtitle={subtitle || 'Комплексное продвижение в социальных сетях для роста вашего бизнеса'}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon]
            const gradient = gradientMap[service.id] || 'from-accent to-accent-secondary'
            const glow = glowMap[service.id] || 'group-hover:shadow-glow'
            
            return (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`}
                className={cn(
                  'opacity-0',
                  isVisible && 'animate-slide-up',
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  'group relative p-8 rounded-3xl bg-secondary border border-border',
                  'transition-all duration-500 hover:-translate-y-2',
                  glow
                )}>
                  {/* Gradient background on hover */}
                  <div className={cn(
                    'absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500',
                    gradient
                  )} />
                  
                  <div className="relative flex items-start gap-5">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                      'transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3',
                      gradient
                    )}>
                      {Icon && <Icon className="w-7 h-7 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-text-secondary leading-relaxed">
                        {service.shortDescription}
                      </p>
                      <div className="mt-5 flex items-center gap-2 text-accent font-semibold">
                        <span>Подробнее</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
