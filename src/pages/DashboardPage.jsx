import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, ShoppingCart, User, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/Badge'
import { api } from '@/utils/api'

const quickActions = [
  { label: 'Новый заказ', icon: PlusCircle, to: '/dashboard/orders/new', variant: 'primary' },
  { label: 'Мои заказы', icon: ShoppingCart, to: '/dashboard/orders', variant: 'secondary' },
  { label: 'Профиль', icon: User, to: '/dashboard/profile', variant: 'secondary' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const activeOrders = orders.filter(o => o.status !== 'completed')
  const completedOrders = orders.filter(o => o.status === 'completed').slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Добро пожаловать, {user?.name?.split(' ')[0] || 'Пользователь'}!
        </h1>
        <p className="mt-2 text-text-secondary">
          Управляйте заказами и отслеживайте их статус
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <Button 
              variant={action.variant} 
              className="w-full justify-start gap-3"
            >
              <action.icon className="w-5 h-5" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Active orders */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Активные заказы</h2>
          <Link 
            to="/dashboard/orders" 
            className="text-accent hover:underline text-sm flex items-center gap-1"
          >
            Все заказы <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-text-secondary">Загрузка...</div>
        ) : activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Link 
                key={order.id} 
                to={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-secondary rounded-12 hover:bg-border/50 transition-colors"
              >
                <div>
                  <div className="font-medium text-text-primary">Заказ #{order.id}</div>
                  <div className="text-sm text-text-secondary">{order.service}</div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <ArrowRight className="w-4 h-4 text-text-secondary" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-text-secondary">
            У вас пока нет активных заказов
            <div className="mt-4">
              <Link to="/dashboard/orders/new">
                <Button size="small">Создать заказ</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Recent completed */}
      {completedOrders.length > 0 && (
        <Card hover={false}>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Последние завершённые
          </h2>
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Link 
                key={order.id} 
                to={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-secondary rounded-12 hover:bg-border/50 transition-colors"
              >
                <div>
                  <div className="font-medium text-text-primary">Заказ #{order.id}</div>
                  <div className="text-sm text-text-secondary">{order.service}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-secondary">{order.createdAt}</span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
