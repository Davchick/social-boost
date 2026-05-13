import { useParams, Navigate } from 'react-router-dom'
import {
  Quote,
  Building2,
  AlertCircle,
  ListOrdered,
  Radio,
  Milestone,
  Sparkles,
} from 'lucide-react'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Badge } from '@/components/common/Badge'
import { Card } from '@/components/common/Card'
import { getCaseBySlug, industryLabelById } from '@/data/cases'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

function AnimatedBlock({ children, className }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div
      ref={ref}
      className={cn('opacity-0 translate-y-5', isVisible && 'animate-fade-in', className)}
    >
      {children}
    </div>
  )
}

function CaseHero({ caseData }) {
  return (
    <section className="py-20 md:py-32 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{industryLabelById?.[caseData.industry] || caseData.industry}</Badge>
            <Badge variant="accent">{caseData.service}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            {caseData.title}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">Клиент: {caseData.client}</p>
          {caseData.summary && (
            <p className="mt-6 text-lg text-text-secondary leading-relaxed border-l-4 border-accent/40 pl-5">
              {caseData.summary}
            </p>
          )}
          <div className="mt-8 aspect-video bg-secondary rounded-20 overflow-hidden">
            <img
              src={caseData.image}
              alt={caseData.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

function AboutSection({ about }) {
  if (!about) return null
  return (
    <Section background="secondary">
      <Container>
        <AnimatedBlock className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-text-primary">
            <Building2 className="w-7 h-7 text-accent flex-shrink-0" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-semibold">О проекте и клиенте</h2>
          </div>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">{about}</p>
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function TaskAndChallengesSection({ task, challenges }) {
  return (
    <Section>
      <Container>
        <AnimatedBlock className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 lg:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">Задача</h2>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">{task}</p>
          </div>
          {challenges?.length > 0 && (
            <Card hover={false} className="bg-white">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" aria-hidden />
                Сложности и ограничения
              </div>
              <ul className="mt-4 space-y-3 text-text-secondary">
                {challenges.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-accent font-medium tabular-nums">{i + 1}.</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function SolutionSection({ solution, steps }) {
  return (
    <Section background="secondary">
      <Container>
        <AnimatedBlock className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 text-text-primary">
            <ListOrdered className="w-7 h-7 text-accent flex-shrink-0" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-semibold">Решение и ход работы</h2>
          </div>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-4xl">{solution}</p>

          {steps?.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {steps.map((step, i) => (
                <Card key={i} hover={false} className="bg-white h-full">
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Шаг {i + 1}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-3 text-text-secondary leading-relaxed">{step.description}</p>
                </Card>
              ))}
            </div>
          )}
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function ChannelsSection({ channels }) {
  if (!channels?.length) return null
  return (
    <Section>
      <Container>
        <AnimatedBlock className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 text-text-primary">
            <Radio className="w-7 h-7 text-accent flex-shrink-0" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-semibold">Каналы и инструменты</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {channels.map((ch) => (
              <span
                key={ch}
                className="inline-flex items-center px-4 py-2 rounded-pill text-sm font-medium bg-secondary text-text-primary border border-border"
              >
                {ch}
              </span>
            ))}
          </div>
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function PhasesSection({ phases }) {
  if (!phases?.length) return null
  return (
    <Section background="secondary">
      <Container>
        <AnimatedBlock className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-text-primary">
            <Milestone className="w-7 h-7 text-accent flex-shrink-0" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-semibold">Этапы проекта</h2>
          </div>
          <div className="mt-10 relative pl-8 border-l-2 border-accent/25">
            {phases.map((phase, i) => (
              <div key={i} className="relative pb-10 last:pb-0">
                <span
                  className="absolute -left-[calc(0.5rem+5px)] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-secondary"
                  aria-hidden
                />
                <h3 className="text-lg font-semibold text-text-primary">{phase.title}</h3>
                <p className="mt-2 text-text-secondary leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function ResultSection({ result, resultDetails, metrics }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <Section ref={ref}>
      <Container>
        <div
          className={cn(
            'max-w-5xl mx-auto',
            'opacity-0 translate-y-5',
            isVisible && 'animate-fade-in'
          )}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary text-center">
            Результат
          </h2>
          <div className="mt-8 text-center text-5xl sm:text-6xl md:text-7xl font-bold text-accent">
            {result}
          </div>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed text-center max-w-3xl mx-auto">
            {resultDetails}
          </p>

          {metrics?.length > 0 && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((item, i) => (
                <Card key={i} hover={false} className="text-center bg-secondary">
                  <div className="text-2xl md:text-3xl font-bold text-text-primary">{item.value}</div>
                  <div className="mt-2 text-sm text-text-secondary leading-snug">{item.label}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

function TakeawaysSection({ takeaways }) {
  if (!takeaways?.length) return null
  return (
    <Section background="secondary">
      <Container>
        <AnimatedBlock className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-text-primary">
            <Sparkles className="w-7 h-7 text-accent flex-shrink-0" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-semibold">Что сработало особенно хорошо</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {takeaways.map((line, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card"
              >
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <p className="text-text-secondary leading-relaxed pt-0.5">{line}</p>
              </li>
            ))}
          </ul>
        </AnimatedBlock>
      </Container>
    </Section>
  )
}

function TestimonialSection({ testimonial }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <Section ref={ref}>
      <Container>
        <div
          className={cn(
            'max-w-3xl mx-auto',
            'opacity-0 translate-y-5',
            isVisible && 'animate-fade-in'
          )}
        >
          <div className="bg-white rounded-20 shadow-card p-8 md:p-12 relative border border-border">
            <Quote className="w-12 h-12 text-accent/20 absolute top-6 left-6" aria-hidden />
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-text-primary leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{testimonial.author.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{testimonial.author}</div>
                  <div className="text-sm text-text-secondary">{testimonial.position}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default function CaseDetailPage() {
  const { slug } = useParams()
  const caseData = getCaseBySlug(slug)

  if (!caseData) {
    return <Navigate to="/cases" replace />
  }

  return (
    <>
      <CaseHero caseData={caseData} />
      <AboutSection about={caseData.about} />
      <TaskAndChallengesSection task={caseData.task} challenges={caseData.challenges} />
      <SolutionSection solution={caseData.solution} steps={caseData.steps} />
      <ChannelsSection channels={caseData.channels} />
      <PhasesSection phases={caseData.phases} />
      <ResultSection
        result={caseData.result}
        resultDetails={caseData.resultDetails}
        metrics={caseData.metrics}
      />
      <TakeawaysSection takeaways={caseData.takeaways} />
      <TestimonialSection testimonial={caseData.testimonial} />
      <CTASection
        title="Обсудим ваш проект?"
        subtitle="Получите бесплатную консультацию и план действий для вашего бизнеса"
      />
    </>
  )
}
