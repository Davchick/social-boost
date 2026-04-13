import { useState } from 'react'
import { Hero } from '@/components/sections/Hero'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { CasesGrid } from '@/components/sections/CasesGrid'
import { cases, industries } from '@/data/cases'
import { cn } from '@/utils/cn'

function Filters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-12">
      {industries.map((industry) => (
        <button
          key={industry.id}
          onClick={() => onFilterChange(industry.id)}
          className={cn(
            'px-5 py-2 rounded-pill text-sm font-medium transition-colors',
            activeFilter === industry.id
              ? 'bg-accent text-white'
              : 'bg-secondary text-text-secondary hover:bg-border'
          )}
        >
          {industry.label}
        </button>
      ))}
    </div>
  )
}

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredCases = activeFilter === 'all' 
    ? cases 
    : cases.filter(c => c.industry === activeFilter)

  return (
    <>
      <Hero
        title="Наши кейсы"
        subtitle="Реальные результаты для реальных клиентов"
      />
      <Section>
        <Container>
          <Filters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <CasesGrid cases={filteredCases} />
        </Container>
      </Section>
      <CTASection 
        title="Хотите такой же результат?"
        subtitle="Обсудим ваш проект и подберём оптимальную стратегию"
      />
    </>
  )
}
