import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { OrdersList } from '@/components/common/OrdersList'
import { usePaginatedList } from '@/hooks/usePaginatedList'
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
    : orders.filter((o) => o.status === activeFilter)

  const {
    page,
    setPage,
    pageItems,
    totalPages,
    rangeFrom,
    rangeTo,
    totalItems,
  } = usePaginatedList(filteredOrders)

  useEffect(() => {
    setPage(1)
  }, [activeFilter, setPage])

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
          <OrdersList
            pageItems={pageItems}
            loading={false}
            pagination={{
              page,
              totalPages,
              onPageChange: setPage,
              rangeFrom,
              rangeTo,
              totalItems,
            }}
          />
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
