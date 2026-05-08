import { Eye, Target, Handshake, Rocket } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { team } from '@/data/team'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

const values = [
  { icon: Eye, title: 'Прозрачность', description: 'Полная отчётность и открытая коммуникация. Вы всегда знаете, что происходит с вашим проектом.' },
  { icon: Target, title: 'Результат', description: 'Мы работаем на достижение конкретных бизнес-целей, а не абстрактных метрик.' },
  { icon: Handshake, title: 'Партнёрство', description: 'Строим долгосрочные отношения и погружаемся в бизнес каждого клиента.' },
  { icon: Rocket, title: 'Развитие', description: 'Постоянно учимся и внедряем новые инструменты для лучших результатов.' },
]

function MissionSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className={cn(
              'opacity-0 translate-y-5',
              isVisible && 'animate-fade-in'
            )}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
              Наша миссия
            </h2>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed">
              Мы помогаем бизнесу расти в digital-пространстве. Наша задача — не просто настроить рекламу, 
              а выстроить систему привлечения клиентов, которая работает предсказуемо и масштабируемо.
            </p>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              За 5 лет работы мы реализовали более 300 проектов в различных отраслях — от малого бизнеса 
              до крупных федеральных компаний. Этот опыт позволяет нам находить эффективные решения для любых задач.
            </p>
          </div>
          <div 
            className={cn(
              'aspect-video bg-secondary rounded-20 flex items-center justify-center',
              'opacity-0 translate-y-5',
              isVisible && 'animate-fade-in stagger-1'
            )}
          >
            <img
              src="/company_crowd.png"
              alt="Команда"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}

function ValuesSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <SectionHeader 
          title="Наши ценности" 
          subtitle="Принципы, которые лежат в основе нашей работы"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card 
              key={index}
              className={cn(
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-16 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{value.title}</h3>
                  <p className="mt-2 text-text-secondary">{value.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function TeamSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <SectionHeader 
          title="Наша команда" 
          subtitle="Профессионалы, которые работают над вашими проектами"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {team.map((member, index) => (
            <div 
              key={member.id}
              className={cn(
                'text-center',
                'opacity-0 translate-y-5',
                isVisible && 'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-text-secondary">
                    {member.initials}
                  </span>
                )}
              </div>
              <h4 className="mt-4 font-medium text-text-primary">{member.name}</h4>
              <p className="mt-1 text-sm text-text-secondary">{member.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default function AboutPage() {
  return (
    <>
      <Hero
        title="О нашем агентстве"
        subtitle="Мы — команда профессионалов в области интернет-маркетинга с опытом более 5 лет"
      />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <CTASection 
        title="Готовы работать вместе?"
        subtitle="Давайте обсудим, как мы можем помочь вашему бизнесу"
      />
    </>
  )
}
