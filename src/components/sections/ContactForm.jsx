import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Textarea } from '@/components/common/Textarea'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await api.submitContactForm(data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-success mx-auto" />
        <h3 className="mt-6 text-2xl font-semibold text-text-primary">
          Заявка отправлена!
        </h3>
        <p className="mt-2 text-text-secondary">
          Мы свяжемся с вами в течение часа в рабочее время.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Имя *"
        placeholder="Как к вам обращаться?"
        error={errors.name?.message}
        {...register('name', { required: 'Введите имя' })}
      />
      
      <Input
        label="Email *"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email', { 
          required: 'Введите email',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email'
          }
        })}
      />
      
      <Input
        label="Телефон *"
        type="tel"
        placeholder="+7 (999) 123-45-67"
        error={errors.phone?.message}
        {...register('phone', { required: 'Введите телефон' })}
      />
      
      <Textarea
        label="Сообщение"
        placeholder="Расскажите о вашем проекте..."
        rows={4}
        {...register('message')}
      />

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
          {...register('consent', { required: true })}
        />
        <label htmlFor="consent" className="text-sm text-text-secondary">
          Я согласен на обработку{' '}
          <Link to="/privacy" className="text-accent hover:underline">
            персональных данных
          </Link>
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-error">Необходимо согласие на обработку данных</p>
      )}

      <Button type="submit" loading={isLoading} className="w-full">
        Отправить заявку
      </Button>
    </form>
  )
}
