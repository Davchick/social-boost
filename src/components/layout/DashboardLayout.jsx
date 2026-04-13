import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from './Header'
import { Footer } from './Footer'
import { Container } from '@/components/common/Container'
import { LayoutDashboard, ShoppingCart, PlusCircle, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const sidebarLinks = [
  { to: '/dashboard', label: 'Сводка', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Мои заказы', icon: ShoppingCart },
  { to: '/dashboard/orders/new', label: 'Новый заказ', icon: PlusCircle },
  { to: '/dashboard/profile', label: 'Профиль', icon: User },
]

export function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-secondary animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header />
      <main className="flex-1 pt-24">
        <Container className="py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="sticky top-24 bg-secondary rounded-2xl border border-border p-3">
                <ul className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                            isActive
                              ? 'bg-gradient-to-r from-accent to-accent-secondary text-white shadow-glow'
                              : 'text-text-secondary hover:bg-tertiary hover:text-text-primary'
                          )
                        }
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
