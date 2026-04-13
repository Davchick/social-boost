import { TrendingUp, Users, BarChart3 } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const advantages = [
  {
    icon: TrendingUp,
    title: 'Измеримый результат',
    description: 'Прозрачная аналитика и отчётность. Вы всегда знаете, на что расходуется бюджет и какой результат это приносит.',
  },
  {
    icon: Users,
    title: 'Индивидуальный подход',
    description: 'Каждый проект уникален. Мы разрабатываем стратегию под ваши цели и особенности бизнеса.',
  },
  {
    icon: BarChart3,
    title: 'Опыт и экспертиза',
    description: 'Более 5 лет на рынке и 300+ успешных проектов. Знаем, что работает в разных нишах.',
  },
]

export function Advantages() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <SectionHeader 
          title="Почему выбирают нас" 
          subtitle="Мы фокусируемся на результате и строим долгосрочные отношения с клиентами"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((item, index) => (
            <div 
              key={index}
              className={cn(
                'text-center',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <item.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
