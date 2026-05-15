import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { Zap, BarChart3, HeadphonesIcon, Palette, Rocket, Shield } from 'lucide-react'

const advantages = [
  {
    icon: Zap,
    title: 'Быстрый старт',
    description: 'Запускаем проекты за 5-7 дней. Без долгих согласований и бюрократии.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: BarChart3,
    title: 'Прозрачная аналитика',
    description: 'Еженедельные отчёты с понятными метриками. Вы всегда знаете, за что платите.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка 24/7',
    description: 'Персональный менеджер на связи в любое время. Отвечаем за 15 минут.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: Palette,
    title: 'Креатив в крови',
    description: 'Создаём контент, который хочется репостить. Никаких шаблонов и скуки.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: Rocket,
    title: 'Фокус на результат',
    description: 'Работаем на продажи, а не на лайки. Цели и показатели согласовываем до старта.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: Shield,
    title: 'Гарантия результата',
    description: 'Не достигли согласованных показателей — возвращаем деньги или работаем бесплатно до результата.',
    color: 'from-indigo-500 to-indigo-400',
  },
]

export function Advantages() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <SectionHeader 
          title="Почему выбирают нас" 
          subtitle="Мы не просто ведём соцсети — мы строим системы привлечения клиентов"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-equal">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div
                key={index}
                className={cn(
                  'group relative p-6 rounded-2xl bg-primary border border-border shadow-card card-equal',
                  'hover:-translate-y-0.5 transition-all duration-200',
                  'opacity-0',
                  isVisible && 'animate-slide-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative flex flex-col flex-1">
                  <div className={cn(
                    'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                    'group-hover:scale-105 transition-transform duration-200',
                    advantage.color
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-text-secondary leading-relaxed flex-1">
                    {advantage.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
