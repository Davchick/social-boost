import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/Badge'
import { TablePagination } from '@/components/common/TablePagination'

const nextStatusMap = {
  new: 'in-progress',
  'in-progress': 'completed',
}

const statusButtonLabel = {
  new: 'В работу',
  'in-progress': 'Завершить',
}

function OrderMeta({ label, value }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="text-text-secondary text-right">{value}</span>
    </div>
  )
}

function OrderListCard({ order }) {
  return (
    <Link
      to={`/dashboard/orders/${order.id}`}
      className="block rounded-xl border border-border bg-secondary/40 p-4 hover:bg-secondary/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-medium text-text-primary">Заявка #{order.id}</p>
          <p className="text-sm text-text-secondary mt-0.5 break-words">{order.service}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="space-y-1.5 border-t border-border pt-3">
        <OrderMeta label="Дата" value={order.createdAt} />
        <OrderMeta label="Бюджет" value={order.budget} />
      </div>
      <p className="mt-3 text-sm text-accent flex items-center gap-1">
        Детали <ArrowRight className="w-4 h-4" />
      </p>
    </Link>
  )
}

function AdminOrderCard({ order, onStatusUpdate, onDelete, statusLoading, deleteLoading }) {
  const nextStatus = nextStatusMap[order.status]

  return (
    <article className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-text-primary">#{order.id}</p>
          <p className="text-sm text-text-secondary mt-0.5">{order.user?.name || '—'}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-text-secondary break-words">{order.service}</p>
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
        {nextStatus && (
          <Button
            size="small"
            onClick={() => onStatusUpdate({ id: order.id, status: nextStatus })}
            loading={statusLoading}
          >
            {statusButtonLabel[order.status]}
          </Button>
        )}
        <Button
          size="small"
          variant="ghost"
          className="text-error hover:bg-error/5"
          onClick={() => onDelete(order.id)}
          loading={deleteLoading}
        >
          Удалить
        </Button>
      </div>
    </article>
  )
}

export function OrdersList({
  pageItems,
  loading,
  emptyMessage = 'Пока нет заявок',
  variant = 'list',
  pagination,
  onStatusUpdate,
  onDelete,
  statusLoading = false,
  deleteLoading = false,
}) {
  if (loading) {
    return <div className="py-12 text-center text-text-secondary">Загрузка...</div>
  }

  if (pageItems.length === 0) {
    return <div className="py-12 text-center text-text-secondary">{emptyMessage}</div>
  }

  const isAdmin = variant === 'admin'

  return (
    <>
      <div className="space-y-3 md:hidden">
        {pageItems.map((order) =>
          isAdmin ? (
            <AdminOrderCard
              key={order.id}
              order={order}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
              statusLoading={statusLoading}
              deleteLoading={deleteLoading}
            />
          ) : (
            <OrderListCard key={order.id} order={order} />
          ),
        )}
      </div>

      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-tertiary/80 border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-text-secondary">
                {isAdmin ? '№' : 'Номер'}
              </th>
              {isAdmin && (
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Клиент</th>
              )}
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Услуга</th>
              {!isAdmin && (
                <>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Дата</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Бюджет</th>
                </>
              )}
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Статус</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {pageItems.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-text-primary">
                  {isAdmin ? `#${order.id}` : order.id}
                </td>
                {isAdmin && (
                  <td className="py-3 px-4 text-text-secondary">{order.user?.name || '—'}</td>
                )}
                <td className="py-3 px-4 text-text-secondary break-words">{order.service}</td>
                {!isAdmin && (
                  <>
                    <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{order.createdAt}</td>
                    <td className="py-3 px-4 text-text-secondary">{order.budget}</td>
                  </>
                )}
                <td className="py-3 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 px-4">
                  {isAdmin ? (
                    <div className="flex flex-wrap justify-end gap-2">
                      {nextStatusMap[order.status] && (
                        <Button
                          size="small"
                          onClick={() =>
                            onStatusUpdate({ id: order.id, status: nextStatusMap[order.status] })
                          }
                          loading={statusLoading}
                        >
                          {statusButtonLabel[order.status]}
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="ghost"
                        className="text-error hover:bg-error/5"
                        onClick={() => onDelete(order.id)}
                        loading={deleteLoading}
                      >
                        Удалить
                      </Button>
                    </div>
                  ) : (
                    <Link
                      to={`/dashboard/orders/${order.id}`}
                      className="text-accent hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      Детали <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          rangeFrom={pagination.rangeFrom}
          rangeTo={pagination.rangeTo}
          totalItems={pagination.totalItems}
        />
      )}
    </>
  )
}
