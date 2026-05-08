import { Hero } from '@/components/sections/Hero'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { CTASection } from '@/components/sections/CTASection'

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Наши услуги"
        subtitle="Комплексный интернет-маркетинг для роста вашего бизнеса"
      />
      <ServicesGrid showHeader={false} />
      <ProcessSteps />
      <CTASection 
        title="Не знаете, с чего начать?"
        subtitle="Оставьте заявку — мы проведём бесплатный аудит и подберём оптимальное решение"
      />
    </>
  )
}
