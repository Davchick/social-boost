import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/Badge'
import { api } from '@/utils/api'

const nextStatusMap = {
  new: 'in-progress',
  'in-progress': 'completed',
}

const statusButtonLabel = {
  new: 'В работу',
  'in-progress': 'Завершить',
}

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

  const deleteOrderMutation = useMutation({
    mutationFn: api.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const markContactProcessedMutation = useMutation({
    mutationFn: (id) => api.updateContactRequestStatus(id, 'processed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] })
    },
  })

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
      <Card hover={false}>
        <div className="py-8 text-center text-text-secondary">Доступно только администратору</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Админ-панель</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover={false}><div className="text-text-secondary">Пользователи</div><div className="text-2xl font-semibold mt-1">{stats.users}</div></Card>
        <Card hover={false}><div className="text-text-secondary">Всего заказов</div><div className="text-2xl font-semibold mt-1">{stats.orders}</div></Card>
        <Card hover={false}><div className="text-text-secondary">Активные заказы</div><div className="text-2xl font-semibold mt-1">{stats.active}</div></Card>
        <Card hover={false}><div className="text-text-secondary">Новые заявки с сайта</div><div className="text-2xl font-semibold mt-1">{stats.newLeads}</div></Card>
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Пользователи</h2>
        {usersLoading ? (
          <div className="py-8 text-center text-text-secondary">Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Имя</th>
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Почта</th>
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Роль</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-3">{user.name}</td>
                    <td className="py-3 px-3">{user.email}</td>
                    <td className="py-3 px-3 text-sm">
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Заявки с формы обратной связи</h2>
        <p className="text-sm text-text-secondary mb-4">
          Все обращения сохраняются в базе. Писем и уведомлений во внешние сервисы в текущей версии нет — обработка ведётся здесь.
        </p>
        {contactLoading ? (
          <div className="py-8 text-center text-text-secondary">Загрузка...</div>
        ) : contactRequests.length === 0 ? (
          <div className="py-6 text-text-secondary text-sm">Пока нет заявок.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-text-secondary">Дата</th>
                  <th className="text-left py-3 px-2 text-text-secondary">Имя</th>
                  <th className="text-left py-3 px-2 text-text-secondary">Контакты</th>
                  <th className="text-left py-3 px-2 text-text-secondary hidden lg:table-cell">Сообщение</th>
                  <th className="text-left py-3 px-2 text-text-secondary">Статус</th>
                  <th className="text-right py-3 px-2 text-text-secondary">Действия</th>
                </tr>
              </thead>
              <tbody>
                {contactRequests.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 align-top">
                    <td className="py-3 px-2 text-text-secondary whitespace-nowrap">{row.createdAt}</td>
                    <td className="py-3 px-2">{row.name}</td>
                    <td className="py-3 px-2">
                      <div className="space-y-1">
                        <a href={`mailto:${row.email}`} className="text-accent hover:underline block break-all">{row.email}</a>
                        <span className="text-text-secondary">{row.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-text-secondary max-w-xs hidden lg:table-cell">
                      {row.message ? (
                        <span className="line-clamp-4">{row.message}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {row.status === 'new' ? (
                        <span className="text-accent font-medium">Новая</span>
                      ) : (
                        <span className="text-success">Обработана</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {row.status === 'new' && (
                        <Button
                          size="small"
                          onClick={() => markContactProcessedMutation.mutate(row.id)}
                          loading={markContactProcessedMutation.isPending}
                        >
                          Обработана
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Заказы</h2>
        {ordersLoading ? (
          <div className="py-8 text-center text-text-secondary">Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">№</th>
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Клиент</th>
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Услуга</th>
                  <th className="text-left py-3 px-3 text-sm text-text-secondary">Статус</th>
                  <th className="text-right py-3 px-3 text-sm text-text-secondary">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-3">#{order.id}</td>
                    <td className="py-3 px-3">{order.user?.name || '-'}</td>
                    <td className="py-3 px-3">{order.service}</td>
                    <td className="py-3 px-3"><StatusBadge status={order.status} /></td>
                    <td className="py-3 px-3">
                      <div className="flex justify-end gap-2">
                        {nextStatusMap[order.status] && (
                          <Button
                            size="small"
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: nextStatusMap[order.status] })}
                            loading={updateStatusMutation.isPending}
                          >
                            {statusButtonLabel[order.status]}
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="ghost"
                          className="text-error hover:bg-error/5"
                          onClick={() => deleteOrderMutation.mutate(order.id)}
                          loading={deleteOrderMutation.isPending}
                        >
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
