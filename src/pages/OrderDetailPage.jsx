import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, Repeat, X } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/Badge'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'

function OrderTimeline({ timeline }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div 
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center z-10',
                item.completed ? 'bg-success' : 'bg-border'
              )}
            >
              {item.completed ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <div className="w-2 h-2 bg-text-secondary rounded-full" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className={cn(
                'font-medium',
                item.completed ? 'text-text-primary' : 'text-text-secondary'
              )}>
                {item.stage}
              </div>
              {item.date && (
                <div className="text-sm text-text-secondary">{item.date}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(id)
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-text-secondary">Заказ не найден</p>
          <div className="mt-4">
            <Link to="/dashboard/orders">
              <Button size="small">К списку заказов</Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link 
            to="/dashboard/orders" 
            className="text-accent hover:underline text-sm flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> К списку заказов
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">
              Заказ #{order.id}
            </h1>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/orders/new">
            <Button variant="secondary" size="small">
              <Repeat className="w-4 h-4 mr-2" /> Повторить
            </Button>
          </Link>
          {order.status === 'new' && (
            <Button variant="ghost" size="small" className="text-error hover:bg-error/5">
              <X className="w-4 h-4 mr-2" /> Отменить
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          <Card hover={false}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Детали заказа
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-12">
                <div className="text-sm text-text-secondary">Услуга</div>
                <div className="font-medium text-text-primary">{order.service}</div>
              </div>
              <div className="p-4 bg-secondary rounded-12">
                <div className="text-sm text-text-secondary">Дата создания</div>
                <div className="font-medium text-text-primary">{order.createdAt}</div>
              </div>
              <div className="p-4 bg-secondary rounded-12">
                <div className="text-sm text-text-secondary">Бюджет</div>
                <div className="font-medium text-text-primary">{order.budget}</div>
              </div>
              <div className="p-4 bg-secondary rounded-12">
                <div className="text-sm text-text-secondary">Регион</div>
                <div className="font-medium text-text-primary">{order.region}</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-secondary rounded-12">
              <div className="text-sm text-text-secondary">Сайт</div>
              <div className="font-medium text-text-primary">{order.website}</div>
            </div>
            
            <div className="mt-4 p-4 bg-secondary rounded-12">
              <div className="text-sm text-text-secondary">Описание задачи</div>
              <div className="mt-1 text-text-primary">{order.description}</div>
            </div>
          </Card>

          {/* Messages placeholder */}
          <Card hover={false}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Переписка
            </h2>
            <div className="py-8 text-center text-text-secondary">
              Здесь будут сообщения по заказу
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div>
          <Card hover={false}>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Статус заказа
            </h2>
            <OrderTimeline timeline={order.timeline} />
          </Card>
        </div>
      </div>
    </div>
  )
}
