import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'
import { TrendingUp, Users, Target, Award } from 'lucide-react'

const stats = [
  { number: '150+', label: 'Довольных клиентов', icon: Users, color: 'from-pink-500 to-rose-500' },
  { number: '5M+', label: 'Охват в месяц', icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
  { number: '300%', label: 'Средний ROI', icon: Target, color: 'from-cyan-500 to-blue-500' },
  { number: '5', label: 'Лет опыта', icon: Award, color: 'from-amber-500 to-orange-500' },
]

export function Stats() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[100px]" />
      
      <Container className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className={cn(
                  'group relative p-6 md:p-8 rounded-3xl bg-secondary border border-border',
                  'hover:-translate-y-2 transition-all duration-500 hover:shadow-glow',
                  'opacity-0',
                  isVisible && 'animate-slide-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={cn(
                  'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4',
                  'group-hover:scale-110 transition-transform duration-500',
                  stat.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Number */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
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
