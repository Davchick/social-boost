import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/contact', label: 'Контакты' },
]

const servicesLinks = [
  { to: '/services/context', label: 'Контекстная реклама' },
  { to: '/services/targeted', label: 'Таргетированная реклама' },
  { to: '/services/seo', label: 'SEO-продвижение' },
  { to: '/services/smm', label: 'SMM' },
]

export function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      <Container>
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company info */}
            <div>
              <Link to="/" className="text-xl font-semibold">
                Ледовских К.А.
              </Link>
              <p className="mt-4 text-white/60 text-sm leading-relaxed">
                Профессиональное агентство интернет-рекламы. Помогаем бизнесу расти с помощью digital-маркетинга.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-3">
                {navigation.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-3">
                {servicesLinks.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="tel:+79001234567" 
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    +7 (900) 123-45-67
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:info@ledovskikh.ru" 
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    info@ledovskikh.ru
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Москва, ул. Примерная, д. 1</span>
                </li>
              </ul>

              {/* Social */}
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://t.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              2026 ИП Ледовских Ксения Андреевна
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-white/40 hover:text-white/60 transition-colors text-sm"
              >
                Политика конфиденциальности
              </Link>
              <Link 
                to="/terms" 
                className="text-white/40 hover:text-white/60 transition-colors text-sm"
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
