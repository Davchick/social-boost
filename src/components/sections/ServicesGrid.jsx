import { Link } from 'react-router-dom'
import { Search, Target, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { services } from '@/data/services'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const iconMap = {
  Search,
  Target,
  TrendingUp,
  Users,
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
            subtitle={subtitle || 'Комплексный подход к интернет-маркетингу для роста вашего бизнеса'}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon]
            return (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`}
                className={cn(
                  'opacity-0 translate-y-5',
                  isVisible && 'animate-fade-in',
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-12 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      {Icon && <Icon className="w-6 h-6 text-accent" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-text-secondary">
                        {service.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                        <span>Подробнее</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
