import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { ArrowRight } from 'lucide-react'
import { CONTACTS } from '@/config/contacts'

export function CTASection({ 
  title = 'Готовы начать?', 
  subtitle = 'Оставьте заявку и мы свяжемся с вами в течение часа',
  buttonText = 'Начать проект',
  buttonHref = '/contact'
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <div 
          className={cn(
            'relative p-8 md:p-12 rounded-2xl border border-border bg-secondary shadow-card',
            'opacity-0',
            isVisible && 'animate-scale-in'
          )}
        >
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-tertiary mb-5">
              <span className="text-sm text-text-secondary">Бесплатная консультация</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary">{title}</h2>
            
            <p className="mt-3 text-base md:text-lg text-text-secondary leading-relaxed">
              {subtitle}
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={buttonHref}>
                <Button size="large" className="group w-full sm:w-auto">
                  {buttonText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href={`tel:${CONTACTS.phone.raw}`}>
                <Button variant="secondary" size="large" className="w-full sm:w-auto">
                  Позвонить
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
