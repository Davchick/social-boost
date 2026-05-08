import { Link } from 'react-router-dom'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

export function CasesGrid({ cases, industryLabelById }) {
  const { ref, isVisible } = useScrollAnimation()

  if (!cases?.length) {
    return (
      <div className="py-14 text-center text-text-secondary">
        Ничего не найдено. Попробуйте изменить фильтр или запрос.
      </div>
    )
  }

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseItem, index) => (
        <Link 
          key={caseItem.id} 
          to={`/cases/${caseItem.slug}`}
          className={cn(
            'group opacity-0',
            isVisible && 'animate-slide-up'
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative h-full rounded-3xl bg-secondary border border-border overflow-hidden transition-all duration-500 hover:border-accent/30 hover:-translate-y-2 hover:shadow-glow">
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={caseItem.image} 
                alt={caseItem.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <Badge>{industryLabelById?.[caseItem.industry] || caseItem.industry}</Badge>
                <Badge variant="accent">{caseItem.service}</Badge>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
                {caseItem.title}
              </h3>
              <p className="mt-1 text-text-secondary">{caseItem.client}</p>
              
              {/* Result */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-2xl font-bold gradient-text">{caseItem.result}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center group-hover:bg-accent transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-text-secondary group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
