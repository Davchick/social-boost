import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { ContactForm } from '@/components/sections/ContactForm'

const contactInfo = [
  { icon: Phone, label: 'Телефон', value: '+7 (900) 123-45-67', href: 'tel:+79001234567' },
  { icon: Mail, label: 'Email', value: 'info@ledovskikh.ru', href: 'mailto:info@ledovskikh.ru' },
  { icon: MapPin, label: 'Адрес', value: 'Москва, ул. Примерная, д. 1' },
  { icon: Clock, label: 'Время работы', value: 'Пн-Пт: 9:00 - 18:00' },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card hover={false}>
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Оставить заявку
              </h2>
              <ContactForm />
            </Card>

            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Контактная информация
              </h2>
              
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

              {/* Social */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Мы в социальных сетях
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://t.me/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors"
                  >
                    <Send className="w-5 h-5 text-accent" />
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8">
                <div className="aspect-video bg-secondary rounded-20 flex items-center justify-center">
                  <span className="text-text-secondary">Карта (Яндекс.Карты)</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
