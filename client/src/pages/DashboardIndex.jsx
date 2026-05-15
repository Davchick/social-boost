import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import DashboardPage from '@/pages/DashboardPage'

export default function DashboardIndex() {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return <Navigate to="/dashboard/admin" replace />
  }

  return <DashboardPage />
}
