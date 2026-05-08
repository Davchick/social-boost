import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Section, SectionHeader } from '@/components/common/Section'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/utils/cn'

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const testimonial = testimonials[currentIndex]

  return (
    <Section>
      <Container>
        <SectionHeader 
          title="Отзывы клиентов" 
          subtitle="Что говорят о нас те, с кем мы работаем"
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="relative p-6 md:p-10 rounded-2xl bg-secondary border border-border shadow-card">
            <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-tertiary flex items-center justify-center">
              <Quote className="w-8 h-8 text-accent" />
            </div>
            
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            <p className="text-lg md:text-xl text-text-primary leading-relaxed font-medium">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-lg font-semibold">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-bold text-text-primary text-lg">
                  {testimonial.author}
                </div>
                <div className="text-text-secondary">
                  {testimonial.position}, {testimonial.company}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="w-11 h-11 rounded-lg bg-secondary border border-border flex items-center justify-center hover:bg-tertiary transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    index === currentIndex 
                      ? 'bg-accent w-8' 
                      : 'bg-border hover:bg-text-muted'
                  )}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-11 h-11 rounded-lg bg-secondary border border-border flex items-center justify-center hover:bg-tertiary transition-all"
            >
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
