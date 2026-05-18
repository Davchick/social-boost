import { lazy, Suspense, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/common/Card'
import { OrdersList } from '@/components/common/OrdersList'
import { ContactRequestsTable } from '@/components/admin/ContactRequestsTable'
import { UsersTable } from '@/components/admin/UsersTable'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { useOrdersSort } from '@/hooks/useOrdersSort'
import { api } from '@/utils/api'

const AdminStatsCharts = lazy(() =>
  import('@/components/admin/AdminStatsCharts').then((m) => ({ default: m.AdminStatsCharts }))
)

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: api.getAdminUsers,
    enabled: isAdmin,
  })

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders,
    enabled: isAdmin,
  })

  const { data: contactRequests = [], isLoading: contactLoading } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: api.getContactRequests,
    enabled: isAdmin,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const rejectOrderMutation = useMutation({
    mutationFn: ({ id, reason }) => api.rejectOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const { sortBy, toggleSort, sorted: sortedOrders } = useOrdersSort(orders)
  const ordersPagination = usePaginatedList(sortedOrders)

  useEffect(() => {
    ordersPagination.setPage(1)
  }, [sortBy, ordersPagination.setPage])

  const stats = useMemo(() => {
    return {
      users: users.length,
      orders: orders.length,
      active: orders.filter((item) => item.status === 'new' || item.status === 'in-progress').length,
      newLeads: contactRequests.filter((r) => r.status === 'new').length,
    }
  }, [users, orders, contactRequests])

  if (!isAdmin) {
    return (
      <Card hover={false} className="h-full">
        <div className="py-8 text-center text-text-secondary">Доступно только администратору</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Статистика</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 grid-equal">
        <Card hover={false} className="h-full"><div className="text-text-secondary">Пользователи</div><div className="text-2xl font-semibold mt-1">{stats.users}</div></Card>
        <Card hover={false} className="h-full"><div className="text-text-secondary">Всего заявок</div><div className="text-2xl font-semibold mt-1">{stats.orders}</div></Card>
        <Card hover={false} className="h-full"><div className="text-text-secondary">Активные заявки</div><div className="text-2xl font-semibold mt-1">{stats.active}</div></Card>
        <Card hover={false} className="h-full"><div className="text-text-secondary">Новые заявки с сайта</div><div className="text-2xl font-semibold mt-1">{stats.newLeads}</div></Card>
      </div>

      <Suspense
        fallback={
          <Card hover={false} className="h-full">
            <div className="py-16 text-center text-text-secondary">Загрузка графиков...</div>
          </Card>
        }
      >
        <AdminStatsCharts orders={orders} contactRequests={contactRequests} />
      </Suspense>

      <Card hover={false} className="h-full">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Заявки с формы обратной связи</h2>
        <p className="text-sm text-text-secondary mb-4">
          Все обращения сохраняются в базе. Писем и уведомлений во внешние сервисы в текущей версии нет — обработка ведётся здесь.
        </p>
        <ContactRequestsTable rows={contactRequests} loading={contactLoading} />
      </Card>

      <Card hover={false} className="h-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Пользователи</h2>
        <UsersTable users={users} loading={usersLoading} />
      </Card>

      <Card hover={false} className="h-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Заявки</h2>
        <OrdersList
          variant="admin"
          pageItems={ordersPagination.pageItems}
          sortBy={sortBy}
          onToggleSort={toggleSort}
          loading={ordersLoading}
          emptyMessage="Пока нет заявок"
          onStatusUpdate={updateStatusMutation.mutate}
          onReject={rejectOrderMutation.mutate}
          statusLoading={updateStatusMutation.isPending}
          rejectLoading={rejectOrderMutation.isPending}
          pagination={{
            page: ordersPagination.page,
            totalPages: ordersPagination.totalPages,
            onPageChange: ordersPagination.setPage,
            rangeFrom: ordersPagination.rangeFrom,
            rangeTo: ordersPagination.rangeTo,
            totalItems: ordersPagination.totalItems,
          }}
        />
      </Card>
    </div>
  )
}
