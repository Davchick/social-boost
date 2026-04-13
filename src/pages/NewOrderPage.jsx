import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, ArrowRight, CheckCircle, Search, Target, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Textarea } from '@/components/common/Textarea'
import { Button } from '@/components/common/Button'
import { services } from '@/data/services'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'

const iconMap = {
  Search,
  Target,
  TrendingUp,
  Users,
}

const steps = [
  { id: 1, title: 'Выбор услуги' },
  { id: 2, title: 'Заполнение брифа' },
  { id: 3, title: 'Подтверждение' },
]

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div 
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= step.id 
                ? 'bg-accent text-white' 
                : 'bg-secondary text-text-secondary'
            )}
          >
            {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
          </div>
          <span 
            className={cn(
              'ml-2 text-sm hidden sm:inline',
              currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'
            )}
          >
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-8 h-0.5 mx-2',
              currentStep > step.id ? 'bg-accent' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

function ServiceSelect({ selectedService, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => {
        const Icon = iconMap[service.icon]
        const isSelected = selectedService?.id === service.id
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service)}
            className={cn(
              'p-6 rounded-20 border-2 text-left transition-all',
              isSelected 
                ? 'border-accent bg-accent/5' 
                : 'border-border hover:border-accent/50'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'w-12 h-12 rounded-12 flex items-center justify-center',
                isSelected ? 'bg-accent/20' : 'bg-secondary'
              )}>
                {Icon && <Icon className={cn('w-6 h-6', isSelected ? 'text-accent' : 'text-text-secondary')} />}
              </div>
              <div>
                <h3 className={cn(
                  'font-semibold',
                  isSelected ? 'text-accent' : 'text-text-primary'
                )}>
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function BriefForm({ register, errors }) {
  return (
    <div className="space-y-6">
      <Input
        label="Сайт компании *"
        placeholder="example.com"
        error={errors.website?.message}
        {...register('website', { required: 'Укажите сайт' })}
      />
      
      <Input
        label="Регион продвижения *"
        placeholder="Москва и МО"
        error={errors.region?.message}
        {...register('region', { required: 'Укажите регион' })}
      />
      
      <Input
        label="Ежемесячный бюджет на рекламу *"
        placeholder="от 50 000 ₽"
        error={errors.budget?.message}
        {...register('budget', { required: 'Укажите бюджет' })}
      />
      
      <Input
        label="Желаемые сроки запуска"
        placeholder="Как можно скорее / через 2 недели"
        {...register('timeline')}
      />
      
      <Textarea
        label="Опишите задачу *"
        placeholder="Расскажите подробнее о вашем бизнесе и целях..."
        rows={4}
        error={errors.description?.message}
        {...register('description', { required: 'Опишите задачу' })}
      />
      
      <Textarea
        label="Дополнительные пожелания"
        placeholder="Есть ли что-то ещё, что нам нужно знать?"
        rows={3}
        {...register('wishes')}
      />
    </div>
  )
}

function Confirmation({ service, formData, orderId }) {
  if (orderId) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-20 h-20 text-success mx-auto" />
        <h2 className="mt-6 text-2xl font-semibold text-text-primary">
          Заказ создан!
        </h2>
        <p className="mt-2 text-text-secondary">
          Номер вашего заказа: <span className="font-semibold">#{orderId}</span>
        </p>
        <p className="mt-4 text-text-secondary">
          Мы свяжемся с вами в течение часа для уточнения деталей.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to={`/dashboard/orders/${orderId}`}>
            <Button>Перейти к заказу</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">В личный кабинет</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">Проверьте данные заказа</h3>
      
      <div className="p-4 bg-secondary rounded-12">
        <div className="text-sm text-text-secondary">Услуга</div>
        <div className="font-medium text-text-primary">{service?.title}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-secondary rounded-12">
          <div className="text-sm text-text-secondary">Сайт</div>
          <div className="font-medium text-text-primary">{formData.website}</div>
        </div>
        <div className="p-4 bg-secondary rounded-12">
          <div className="text-sm text-text-secondary">Регион</div>
          <div className="font-medium text-text-primary">{formData.region}</div>
        </div>
        <div className="p-4 bg-secondary rounded-12">
          <div className="text-sm text-text-secondary">Бюджет</div>
          <div className="font-medium text-text-primary">{formData.budget}</div>
        </div>
        <div className="p-4 bg-secondary rounded-12">
          <div className="text-sm text-text-secondary">Сроки</div>
          <div className="font-medium text-text-primary">{formData.timeline || 'Не указаны'}</div>
        </div>
      </div>
      
      <div className="p-4 bg-secondary rounded-12">
        <div className="text-sm text-text-secondary">Описание задачи</div>
        <div className="mt-1 text-text-primary">{formData.description}</div>
      </div>
      
      {formData.wishes && (
        <div className="p-4 bg-secondary rounded-12">
          <div className="text-sm text-text-secondary">Дополнительные пожелания</div>
          <div className="mt-1 text-text-primary">{formData.wishes}</div>
        </div>
      )}
    </div>
  )
}

export default function NewOrderPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm()

  const handleServiceSelect = (service) => {
    setSelectedService(service)
  }

  const handleNext = () => {
    if (step === 1 && !selectedService) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleBriefSubmit = (data) => {
    setStep(3)
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    try {
      const formData = getValues()
      const result = await api.createOrder({
        service: selectedService,
        ...formData,
      })
      setOrderId(result.orderId)
    } catch (error) {
      console.error('Error creating order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card hover={false}>
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Оформление заказа
        </h1>
        <p className="text-text-secondary mb-8">
          Заполните форму и мы свяжемся с вами для уточнения деталей
        </p>

        <StepIndicator currentStep={step} />

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Выберите услугу
            </h2>
            <ServiceSelect 
              selectedService={selectedService} 
              onSelect={handleServiceSelect} 
            />
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={!selectedService}
              >
                Далее <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(handleBriefSubmit)}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Заполните бриф
            </h2>
            <BriefForm register={register} errors={errors} />
            <div className="mt-8 flex justify-between">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Назад
              </Button>
              <Button type="submit">
                Далее <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <>
            <Confirmation 
              service={selectedService} 
              formData={getValues()} 
              orderId={orderId}
            />
            {!orderId && (
              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Назад
                </Button>
                <Button onClick={handleFinalSubmit} loading={isLoading}>
                  Отправить заказ
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
