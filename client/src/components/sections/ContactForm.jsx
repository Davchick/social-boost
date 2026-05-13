import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CheckCircle, Sparkles, Send } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Textarea } from '@/components/common/Textarea'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'
import { phoneFieldRulesRequired } from '@/utils/validation'
import { PhoneInput } from '@/components/common/PhoneInput'

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, control, handleSubmit, formState: { errors } } = useForm()

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
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-text-primary">
          Заявка отправлена!
        </h3>
        <p className="mt-2 text-text-secondary">
          Мы свяжемся с вами в течение часа в рабочее время.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Имя"
        placeholder="Как к вам обращаться?"
        error={errors.name?.message}
        {...register('name', { required: 'Введите имя' })}
      />
      
      <Input
        label="Эл. почта"
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
      
      <PhoneInput
        name="phone"
        control={control}
        label="Телефон"
        placeholder="+7 (999) 123-45-67"
        rules={phoneFieldRulesRequired}
      />
      
      <Textarea
        label="Сообщение"
        placeholder="Расскажите о вашем проекте..."
        rows={4}
        {...register('message')}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="consent"
          className="w-5 h-5 rounded-md border-border bg-secondary text-accent focus:ring-accent focus:ring-offset-0 focus:ring-offset-primary"
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

      <Button type="submit" loading={isLoading} className="w-full group">
        <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
        Отправить заявку
      </Button>
    </form>
  )
}
