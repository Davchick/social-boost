import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Phone, Mail, MapPin, Send, Sparkles } from 'lucide-react'

const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/contact', label: 'Контакты' },
]

const servicesLinks = [
  { to: '/services/smm', label: 'SMM-продвижение' },
  { to: '/services/targeted', label: 'Таргетированная реклама' },
  { to: '/services/reels', label: 'Reels и TikTok' },
  { to: '/services/influence', label: 'Работа с блогерами' },
]

export function Footer() {
  return (
    <footer className="relative bg-secondary border-t border-border overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      
      <Container className="relative">
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company info */}
            <div>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-text-primary">
                  Social<span className="gradient-text">Boost</span>
                </span>
              </Link>
              <p className="mt-5 text-text-secondary text-sm leading-relaxed">
                SMM-агентство нового поколения. Помогаем бизнесу расти в социальных сетях с измеримым результатом.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-text-primary mb-5">Навигация</h4>
              <ul className="space-y-3">
                {navigation.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-text-secondary hover:text-accent transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-text-primary mb-5">Услуги</h4>
              <ul className="space-y-3">
                {servicesLinks.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-text-secondary hover:text-accent transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold text-text-primary mb-5">Контакты</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="tel:+79001234567" 
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors text-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    +7 (900) 123-45-67
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:hello@socialboost.ru" 
                    className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors text-sm group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    hello@socialboost.ru
                  </a>
                </li>
                <li className="flex items-start gap-3 text-text-secondary text-sm">
                  <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="pt-2">Москва, Пресненская наб., 12</span>
                </li>
              </ul>

              {/* Social */}
              <div className="flex gap-3 mt-6">
                <a 
                  href="https://t.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-all social-icon"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
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
