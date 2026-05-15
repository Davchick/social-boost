import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { TrendingUp, Users, Target, Award } from 'lucide-react'

const stats = [
  { number: '150+', label: 'Довольных клиентов', icon: Users, color: 'from-indigo-500 to-indigo-400' },
  { number: '5M+', label: 'Охват в месяц', icon: TrendingUp, color: 'from-indigo-500 to-indigo-400' },
  { number: '300%', label: 'Средняя окупаемость', icon: Target, color: 'from-indigo-500 to-indigo-400' },
  { number: '5', label: 'Лет опыта', icon: Award, color: 'from-indigo-500 to-indigo-400' },
]

export function Stats() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 grid-equal">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className={cn(
                  'group relative p-5 md:p-6 rounded-2xl bg-secondary border border-border shadow-card h-full card-equal',
                  'hover:-translate-y-0.5 transition-all duration-200 hover:shadow-card-hover',
                  'opacity-0',
                  isVisible && 'animate-slide-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={cn(
                  'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                  'group-hover:scale-105 transition-transform duration-200',
                  stat.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Number */}
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="mt-2 text-text-secondary text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
