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
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Прозрачная аналитика',
    description: 'Еженедельные отчёты с понятными метриками. Вы всегда знаете, за что платите.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка 24/7',
    description: 'Персональный менеджер на связи в любое время. Отвечаем за 15 минут.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Креатив в крови',
    description: 'Создаём контент, который хочется репостить. Никаких шаблонов и скуки.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Rocket,
    title: 'Фокус на результат',
    description: 'Работаем на продажи, а не на лайки. KPI согласовываем до старта.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Гарантия результата',
    description: 'Не достигли KPI — возвращаем деньги или работаем бесплатно до результата.',
    color: 'from-red-500 to-rose-500',
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div
                key={index}
                className={cn(
                  'group relative p-8 rounded-3xl bg-primary border border-border',
                  'hover:-translate-y-2 transition-all duration-500 hover:border-accent/30',
                  'opacity-0',
                  isVisible && 'animate-slide-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient background on hover */}
                <div className={cn(
                  'absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500',
                  advantage.color
                )} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5',
                    'group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500',
                    advantage.color
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {advantage.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed">
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
