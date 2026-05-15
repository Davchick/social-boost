import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Header } from './Header'
import { Footer } from './Footer'
import { Container } from '@/components/common/Container'
import { LayoutDashboard, ClipboardList, PlusCircle, User, BarChart3 } from 'lucide-react'
import { cn } from '@/utils/cn'

const userSidebarLinks = [
  { to: '/dashboard', label: 'Сводка', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Мои заявки', icon: ClipboardList },
  { to: '/dashboard/orders/new', label: 'Новая заявка', icon: PlusCircle },
  { to: '/dashboard/profile', label: 'Профиль', icon: User },
]

const adminSidebarLinks = [
  { to: '/dashboard/admin', label: 'Статистика', icon: BarChart3 },
  { to: '/dashboard/orders', label: 'Заявки', icon: ClipboardList },
  { to: '/dashboard/profile', label: 'Профиль', icon: User },
]

export function DashboardLayout() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const location = useLocation()
  const sidebarLinks = isAdmin ? adminSidebarLinks : userSidebarLinks
  const wideAdminLayout = isAdmin && location.pathname.startsWith('/dashboard/admin')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-10 h-10 rounded-xl bg-accent/20 animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header />
      <main className="flex-1 pt-20">
        <Container className={cn('py-6 md:py-10', wideAdminLayout && 'max-w-container-wide')}>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="sticky top-24 bg-secondary rounded-xl border border-border p-3 shadow-card">
                <ul className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                            isActive
                              ? 'bg-tertiary text-text-primary border border-border'
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
