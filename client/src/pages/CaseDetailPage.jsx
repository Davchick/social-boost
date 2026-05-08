import { useParams, Navigate } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { Badge } from '@/components/common/Badge'
import { getCaseBySlug, industryLabelById } from '@/data/cases'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

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
          <p className="mt-4 text-xl text-text-secondary">
            Клиент: {caseData.client}
          </p>
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

function TaskSection({ task }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <div className={cn(
          'max-w-3xl mx-auto',
          'opacity-0 translate-y-5',
          isVisible && 'animate-fade-in'
        )}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">Задача</h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">{task}</p>
        </div>
      </Container>
    </Section>
  )
}

function SolutionSection({ solution }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <div className={cn(
          'max-w-3xl mx-auto',
          'opacity-0 translate-y-5',
          isVisible && 'animate-fade-in'
        )}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">Решение</h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">{solution}</p>
        </div>
      </Container>
    </Section>
  )
}

function ResultSection({ result, resultDetails }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref} background="secondary">
      <Container>
        <div className={cn(
          'max-w-3xl mx-auto text-center',
          'opacity-0 translate-y-5',
          isVisible && 'animate-fade-in'
        )}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">Результат</h2>
          <div className="mt-8 text-6xl md:text-7xl font-bold text-accent">{result}</div>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">{resultDetails}</p>
        </div>
      </Container>
    </Section>
  )
}

function TestimonialSection({ testimonial }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <Section ref={ref}>
      <Container>
        <div className={cn(
          'max-w-3xl mx-auto',
          'opacity-0 translate-y-5',
          isVisible && 'animate-fade-in'
        )}>
          <div className="bg-white rounded-20 shadow-card p-8 md:p-12 relative">
            <Quote className="w-12 h-12 text-accent/20 absolute top-6 left-6" />
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-text-primary leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.position}
                  </div>
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
      <TaskSection task={caseData.task} />
      <SolutionSection solution={caseData.solution} />
      <ResultSection result={caseData.result} resultDetails={caseData.resultDetails} />
      <TestimonialSection testimonial={caseData.testimonial} />
      <CTASection 
        title="Обсудим ваш проект?"
        subtitle="Получите бесплатную консультацию и план действий для вашего бизнеса"
      />
    </>
  )
}
