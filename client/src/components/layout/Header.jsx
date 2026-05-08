import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'
import { Container } from '@/components/common/Container'
import { cn } from '@/utils/cn'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/contact', label: 'Контакты' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200',
        scrolled ? 'bg-secondary/95 backdrop-blur border-border py-2' : 'bg-secondary/90 border-transparent py-3'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-semibold text-text-primary">
              Продвижение
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive 
                      ? 'text-text-primary bg-tertiary border border-border' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-tertiary'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-tertiary transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-accent text-sm font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-text-primary text-sm">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-secondary rounded-xl border border-border shadow-card p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-tertiary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Мой кабинет
                    </Link>
                    <Link
                      to="/dashboard/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-tertiary transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Мои заказы
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-tertiary transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Профиль
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="small">Войти</Button>
                </Link>
                <Link to="/contact">
                  <Button size="small">Оставить заявку</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-primary hover:bg-tertiary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-primary/98 backdrop-blur z-40 border-t border-border">
          <Container className="py-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'text-base py-3 px-3 rounded-lg transition-colors',
                      isActive ? 'text-text-primary bg-secondary border border-border' : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              <hr className="my-4 border-border" />
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base py-3 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary"
                  >
                    Мой кабинет
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base py-3 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary"
                  >
                    Мои заказы
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-base py-3 px-3 rounded-lg text-error text-left hover:bg-error/10"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Войти</Button>
                  </Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Оставить заявку</Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
