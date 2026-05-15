import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { ContactForm } from '@/components/sections/ContactForm'
import { YandexMapEmbed } from '@/components/sections/YandexMapEmbed'
import { CONTACTS } from '@/config/contacts'

const contactInfo = [
  { icon: Phone, label: 'Телефон', value: CONTACTS.phone.display, href: `tel:${CONTACTS.phone.raw}` },
  { icon: Mail, label: 'Эл. почта', value: CONTACTS.email.display, href: `mailto:${CONTACTS.email.raw}` },
  { icon: MapPin, label: 'Адрес', value: CONTACTS.address },
  { icon: Clock, label: 'Время работы', value: CONTACTS.workHours },
]

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Свяжитесь с нами"
        subtitle="Оставьте заявку и мы перезвоним вам в течение часа"
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-stretch grid-equal">
            {/* Form */}
            <Card hover={false}>
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Оставить заявку
              </h2>
              <ContactForm />
            </Card>

            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-6">Контакты</h2>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">{item.label}</div>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          className="text-text-primary hover:text-accent transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-text-primary">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Мы на карте</h2>
            <YandexMapEmbed address={CONTACTS.address} />
          </div>
        </Container>
      </Section>
    </>
  )
}
