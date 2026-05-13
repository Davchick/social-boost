import { ClipboardList, Lightbulb, Rocket, Settings, FileText } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const steps = [
  { icon: ClipboardList, title: 'Аудит', description: 'Анализируем текущую ситуацию, конкурентов и целевую аудиторию' },
  { icon: Lightbulb, title: 'Стратегия', description: 'Разрабатываем план действий и определяем измеримые цели' },
  { icon: Rocket, title: 'Запуск', description: 'Настраиваем и запускаем рекламные кампании' },
  { icon: Settings, title: 'Оптимизация', description: 'Постоянно улучшаем показатели на основе данных' },
  { icon: FileText, title: 'Отчёт', description: 'Предоставляем прозрачную отчётность по результатам' },
]

export function ProcessSteps() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <SectionHeader 
          title="Как мы работаем" 
          subtitle="Прозрачный процесс от первого контакта до результата"
        />
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  'text-center relative',
                  'opacity-0 translate-y-5',
                  isVisible && 'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-card flex items-center justify-center relative z-10">
                  <step.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm lg:left-1/2 lg:-translate-x-1/2">
                  {index + 1}
                </div>
                <h3 className="mt-6 font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
