import { useState } from 'react'
import { Hero } from '@/components/sections/Hero'
import { CTASection } from '@/components/sections/CTASection'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { CasesGrid } from '@/components/sections/CasesGrid'
import { cases, industries, industryLabelById } from '@/data/cases'
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
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('result-desc')

  const normalizedQuery = query.trim().toLowerCase()
  const byIndustry = activeFilter === 'all' ? cases : cases.filter((c) => c.industry === activeFilter)
  const byQuery = normalizedQuery
    ? byIndustry.filter((c) => {
        const haystack = `${c.title} ${c.client} ${c.service}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : byIndustry

  const filteredCases = [...byQuery].sort((a, b) => {
    if (sort === 'result-asc') return (a.resultNumber || 0) - (b.resultNumber || 0)
    if (sort === 'title') return String(a.title).localeCompare(String(b.title), 'ru')
    return (b.resultNumber || 0) - (a.resultNumber || 0)
  })

  return (
    <>
      <Hero
        title="Наши кейсы"
        subtitle="Реальные результаты для реальных клиентов"
      />
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по кейсам: ниша, клиент, услуга..."
                  className="w-full h-12 px-4 rounded-14 border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div className="md:col-span-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full h-12 px-4 rounded-14 border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="result-desc">Сначала сильные результаты</option>
                  <option value="result-asc">Сначала небольшие результаты</option>
                  <option value="title">По названию</option>
                </select>
              </div>
            </div>
            <div className="mt-3 text-sm text-text-muted text-center">
              Найдено: {filteredCases.length}
            </div>
          </div>

          <Filters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <CasesGrid cases={filteredCases} industryLabelById={industryLabelById} />
        </Container>
      </Section>
      <CTASection 
        title="Хотите такой же результат?"
        subtitle="Обсудим ваш проект и подберём оптимальную стратегию"
      />
    </>
  )
}
