import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/utils/cn'

export function CasesGrid({ cases }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseItem, index) => (
        <Link 
          key={caseItem.id} 
          to={`/cases/${caseItem.slug}`}
          className={cn(
            'opacity-0 translate-y-5',
            isVisible && 'animate-fade-in'
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card className="h-full group">
            <div className="aspect-video bg-secondary rounded-12 overflow-hidden mb-4">
              <img 
                src={caseItem.image} 
                alt={caseItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>{caseItem.industry}</Badge>
              <Badge variant="accent">{caseItem.service}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
              {caseItem.title}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">{caseItem.client}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-accent">{caseItem.result}</span>
              <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
