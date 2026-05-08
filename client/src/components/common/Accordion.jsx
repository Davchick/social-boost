import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Accordion({ items, className }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  )
}

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-12 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-text-primary pr-4">{question}</span>
        <ChevronDown 
          className={cn(
            'w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      <div 
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="p-5 pt-0 text-text-secondary">
          {answer}
        </div>
      </div>
    </div>
  )
}
