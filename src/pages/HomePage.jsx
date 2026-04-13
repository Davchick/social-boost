import { Hero } from '@/components/sections/Hero'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Advantages } from '@/components/sections/Advantages'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero
        title="Интернет-реклама, которая приносит результат"
        subtitle="Привлекаем клиентов для вашего бизнеса через контекстную и таргетированную рекламу, SEO и SMM. Прозрачная аналитика и измеримый ROI."
        primaryCta={{ label: 'Оставить заявку', href: '/contact' }}
        secondaryCta={{ label: 'Наши кейсы', href: '/cases' }}
      />
      <ServicesGrid limit={4} />
      <Advantages />
      <Stats />
      <Testimonials />
      <CTASection 
        title="Готовы увеличить продажи?"
        subtitle="Получите бесплатную консультацию и аудит текущих рекламных кампаний"
      />
    </>
  )
}
