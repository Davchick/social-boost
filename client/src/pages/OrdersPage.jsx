import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/Badge'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'

const statusFilters = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'in-progress', label: 'В работе' },
  { id: 'completed', label: 'Завершённые' },
]

export default function OrdersPage() {
  const { isAdmin } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders,
  })

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">
          {isAdmin ? 'Заявки' : 'Мои заявки'}
        </h1>
        {!isAdmin && (
          <Link to="/dashboard/orders/new">
            <Button size="small">
              <Plus className="w-4 h-4 mr-2" />
              Новая заявка
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              'px-4 py-2 rounded-pill text-sm font-medium transition-colors',
              activeFilter === filter.id
                ? 'bg-accent text-white'
                : 'bg-white text-text-secondary hover:bg-secondary'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <Card hover={false}>
        {isLoading ? (
          <div className="py-12 text-center text-text-secondary">Загрузка...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Номер</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Услуга</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary hidden sm:table-cell">Дата</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary hidden md:table-cell">Бюджет</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Статус</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="py-4 px-4 font-medium text-text-primary">{order.id}</td>
                    <td className="py-4 px-4 text-text-secondary">{order.service}</td>
                    <td className="py-4 px-4 text-text-secondary hidden sm:table-cell">{order.createdAt}</td>
                    <td className="py-4 px-4 text-text-secondary hidden md:table-cell">{order.budget}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <Link 
                        to={`/dashboard/orders/${order.id}`}
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        Детали <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-text-secondary">
            {activeFilter === 'all'
              ? isAdmin
                ? 'Пока нет заявок'
                : 'У вас пока нет заявок'
              : 'Нет заявок с таким статусом'}
            {!isAdmin && (
              <div className="mt-4">
                <Link to="/dashboard/orders/new">
                  <Button size="small">Создать заявку</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
