import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Layouts
import { MainLayout } from '@/components/layout/MainLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Pages
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ServicesPage from '@/pages/ServicesPage'
import ServiceDetailPage from '@/pages/ServiceDetailPage'
import CasesPage from '@/pages/CasesPage'
import CaseDetailPage from '@/pages/CaseDetailPage'
import ContactPage from '@/pages/ContactPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import OrdersPage from '@/pages/OrdersPage'
import NewOrderPage from '@/pages/NewOrderPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import ProfilePage from '@/pages/ProfilePage'
import AdminPage from '@/pages/AdminPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:slug" element={<CaseDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/orders/new" element={<NewOrderPage />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetailPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
