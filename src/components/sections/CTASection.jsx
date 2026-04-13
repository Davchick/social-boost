import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

export function CTASection({ 
  title = 'Готовы начать?', 
  subtitle = 'Оставьте заявку и мы свяжемся с вами в течение часа',
  buttonText = 'Оставить заявку',
  buttonHref = '/contact'
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <div 
          className={cn(
            'text-center max-w-2xl mx-auto',
            'opacity-0 translate-y-5',
            isVisible && 'animate-fade-in'
          )}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary text-balance">
            {title}
          </h2>
          <p className="mt-4 text-lg text-text-secondary text-pretty">
            {subtitle}
          </p>
          <div className="mt-8">
            <Link to={buttonHref}>
              <Button size="large">{buttonText}</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
