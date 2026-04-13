import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const stats = [
  { number: '150+', label: 'Клиентов' },
  { number: '300+', label: 'Проектов' },
  { number: '250%', label: 'Средний ROI' },
  { number: '5', label: 'Лет на рынке' },
]

export function Stats() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={cn(
                'text-center',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent">
                {stat.number}
              </div>
              <div className="mt-2 text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
