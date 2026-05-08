import { useParams, Link, Navigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Accordion } from '@/components/common/Accordion'
import { getServiceBySlug } from '@/data/services'
import { cases } from '@/data/cases'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

function FeaturesSection({ features }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <SectionHeader 
          title="Что включено" 
          subtitle="Полный комплекс работ для достижения результата"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                'flex items-center gap-3 p-4 bg-secondary rounded-12',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-success" />
              </div>
              <span className="text-text-primary">{feature}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function BenefitsSection({ benefits }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <SectionHeader 
          title="Преимущества" 
          subtitle="Почему клиенты выбирают нас для этой услуги"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className={cn(
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-text-primary font-medium">{benefit}</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function PricingSection({ pricing }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <SectionHeader 
          title="Тарифы" 
          subtitle="Выберите подходящий вариант или обсудите индивидуальные условия"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((plan, index) => (
            <Card 
              key={index}
              className={cn(
                index === 1 && 'ring-2 ring-accent',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {index === 1 && (
                <div className="text-xs font-medium text-accent mb-4">Популярный выбор</div>
              )}
              <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
              <div className="mt-2 text-2xl font-bold text-accent">{plan.price}</div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/contact">
                  <Button 
                    variant={index === 1 ? 'primary' : 'secondary'} 
                    className="w-full"
                  >
                    Заказать
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function RelatedCasesSection({ service }) {
  const { ref, isVisible } = useScrollAnimation()
  const relatedCases = cases.filter(c => c.service.includes(service)).slice(0, 3)

  if (relatedCases.length === 0) return null

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <SectionHeader 
          title="Кейсы по услуге" 
          subtitle="Примеры наших работ"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedCases.map((caseItem, index) => (
            <Link 
              key={caseItem.id} 
              to={`/cases/${caseItem.slug}`}
              className={cn(
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="group">
                <div className="aspect-video bg-secondary rounded-12 overflow-hidden mb-4">
                  <img 
                    src={caseItem.image} 
                    alt={caseItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {caseItem.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">{caseItem.client}</p>
                <div className="mt-2 text-accent font-semibold">{caseItem.result}</div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function FAQSection({ faq }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <SectionHeader 
          title="Частые вопросы" 
          subtitle="Ответы на популярные вопросы об услуге"
        />
        <div 
          className={cn(
            'max-w-3xl mx-auto',
            'opacity-0 translate-y-5',
            isVisible && 'animate-fade-in'
          )}
        >
          <Accordion items={faq} />
        </div>
      </Container>
    </Section>
  )
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) {
    return <Navigate to="/services" replace />
  }

  return (
    <>
      <Hero
        title={service.title}
        subtitle={service.description}
        primaryCta={{ label: 'Оставить заявку', href: '/contact' }}
        secondaryCta={{ label: 'Все услуги', href: '/services' }}
      />
      <FeaturesSection features={service.features} />
      <BenefitsSection benefits={service.benefits} />
      <PricingSection pricing={service.pricing} />
      <RelatedCasesSection service={service.title} />
      <FAQSection faq={service.faq} />
      <CTASection 
        title="Готовы начать?"
        subtitle="Оставьте заявку и получите бесплатную консультацию"
      />
    </>
  )
}
