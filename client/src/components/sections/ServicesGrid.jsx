import { Link } from 'react-router-dom'
import { Target, Video, Users, ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { services } from '@/data/services'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const iconMap = {
  Target,
  Video,
  Users,
}

const gradientMap = {
  'smm': 'from-indigo-500 to-indigo-400',
  'targeted': 'from-indigo-500 to-indigo-400',
  'reels': 'from-indigo-500 to-indigo-400',
  'influence': 'from-indigo-500 to-indigo-400',
}

const glowMap = {
  'smm': 'group-hover:shadow-card-hover',
  'targeted': 'group-hover:shadow-card-hover',
  'reels': 'group-hover:shadow-card-hover',
  'influence': 'group-hover:shadow-card-hover',
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
            subtitle={subtitle || 'Соцсети, таргет, контекстная реклама и контент — подбираем связку под вашу задачу'}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grid-equal">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon]
            const gradient = gradientMap[service.id] || 'from-accent to-accent-secondary'
            const glow = glowMap[service.id] || 'group-hover:shadow-glow'
            
            return (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`}
                className={cn(
                  'block h-full opacity-0',
                  isVisible && 'animate-slide-up',
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  'group relative p-6 md:p-7 rounded-2xl bg-secondary border border-border shadow-card h-full card-equal',
                  'transition-all duration-200 hover:-translate-y-0.5',
                  glow
                )}>
                  <div className="relative flex items-start gap-5 flex-1">
                    <div className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                      'transition-transform duration-200 group-hover:scale-105',
                      gradient
                    )}>
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-text-primary">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-text-secondary leading-relaxed">
                        {service.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                        <span>Подробнее</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
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
