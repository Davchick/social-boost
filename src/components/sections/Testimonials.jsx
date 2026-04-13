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
          <div className="relative p-8 md:p-12 rounded-3xl bg-secondary border border-border">
            {/* Gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary rounded-full" />
            
            {/* Quote icon */}
            <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 flex items-center justify-center">
              <Quote className="w-8 h-8 text-accent" />
            </div>
            
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            {/* Quote text */}
            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-medium">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            
            {/* Author */}
            <div className="mt-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <span className="text-white text-xl font-bold">
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

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all"
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
                      ? 'bg-gradient-to-r from-accent to-accent-secondary w-8' 
                      : 'bg-border hover:bg-text-muted'
                  )}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
