import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection({ 
  title = 'Готовы начать?', 
  subtitle = 'Оставьте заявку и мы свяжемся с вами в течение часа',
  buttonText = 'Начать проект',
  buttonHref = '/contact'
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-secondary/20 rounded-full blur-[100px]" />
      </div>
      
      <Container className="relative">
        <div 
          className={cn(
            'relative p-12 md:p-16 rounded-3xl overflow-hidden',
            'opacity-0',
            isVisible && 'animate-scale-in'
          )}
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary p-[1px]">
            <div className="absolute inset-[1px] rounded-3xl bg-primary" />
          </div>
          
          {/* Content */}
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary">Бесплатная консультация</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="gradient-text">{title}</span>
            </h2>
            
            <p className="mt-4 text-lg md:text-xl text-text-secondary leading-relaxed">
              {subtitle}
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={buttonHref}>
                <Button size="large" className="group">
                  {buttonText}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="large">
                  Написать в Telegram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
