import { Hero } from '@/components/sections/Hero'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Advantages } from '@/components/sections/Advantages'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTASection } from '@/components/sections/CTASection'
import { ClientsMarquee } from '@/components/sections/ClientsMarquee'

export default function HomePage() {
  return (
    <>
      <Hero
        title="Прокачиваем ваши социальные сети"
        subtitle="Агентство социальных сетей нового поколения. Создаём вирусный контент, запускаем рекламу с подбором аудитории и работаем с блогерами. Результат — рост продаж и узнаваемости."
        primaryCta={{ label: 'Начать проект', href: '/contact' }}
        secondaryCta={{ label: 'Смотреть кейсы', href: '/cases' }}
      />
      <ClientsMarquee />
      <ServicesGrid limit={4} />
      <Stats />
      <Advantages />
      <Testimonials />
      <CTASection 
        title="Готовы прокачать соцсети?"
        subtitle="Получите бесплатный аудит ваших социальных сетей и стратегию продвижения"
      />
    </>
  )
}
