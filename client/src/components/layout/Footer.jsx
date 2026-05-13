import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Phone, Mail, MapPin } from 'lucide-react'
import { CONTACTS } from '@/config/contacts'

const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/contact', label: 'Контакты' },
]

const servicesLinks = [
  { to: '/services/smm', label: 'Продвижение в соцсетях' },
  { to: '/services/targeted', label: 'Таргетированная реклама' },
  { to: '/services/reels', label: 'Короткие видео' },
  { to: '/services/influence', label: 'Работа с блогерами' },
]

export function Footer() {
  return (
    <footer className="relative bg-secondary border-t border-border">
      <Container className="relative">
        <div className="py-12 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <Link to="/" className="flex items-center gap-2 group">
                <span className="text-lg font-semibold text-text-primary">
                  Продвижение
                </span>
              </Link>
              <p className="mt-5 text-text-secondary text-sm leading-relaxed">
                Агентство социальных сетей нового поколения. Помогаем бизнесу расти в социальных сетях с измеримым результатом.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-5">Навигация</h4>
              <ul className="space-y-3">
                {navigation.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-5">Услуги</h4>
              <ul className="space-y-3">
                {servicesLinks.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-5">Контакты</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href={`tel:${CONTACTS.phone.raw}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors text-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center group-hover:bg-border transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    {CONTACTS.phone.display}
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${CONTACTS.email.raw}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors text-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center group-hover:bg-border transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    {CONTACTS.email.display}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-text-secondary text-sm">
                  <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="pt-2">{CONTACTS.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              2024 ИП Ледовских Ксения Андреевна. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                Политика конфиденциальности
              </Link>
              <Link 
                to="/terms" 
                className="text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
