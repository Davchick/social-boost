import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Clock, Repeat } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'

const benefits = [
  { icon: ShoppingCart, text: 'Отслеживание статуса заявок' },
  { icon: Clock, text: 'История всех проектов' },
  { icon: Repeat, text: 'Быстрое оформление повторных заявок' },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    try {
      const result = await api.login(data.email, data.password)
      login(result.user, result.token)
      navigate(result.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard')
    } catch (err) {
      setError('Неверный email или пароль')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section className="min-h-[calc(100vh-80px)] flex items-center">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-stretch grid-equal">
            {/* Form */}
            <Card hover={false}>
              <h1 className="text-2xl font-semibold text-text-primary mb-6">
                Вход в аккаунт
              </h1>

              {error && (
                <div className="mb-4 p-3 bg-error/10 text-error rounded-12 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                
                <PasswordInput
                  label="Пароль"
                  placeholder="Введите пароль"
                  error={errors.password?.message}
                  {...register('password', { required: 'Введите пароль' })}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-text-secondary">Запомнить меня</span>
                  </label>
                  <a href="#" className="text-sm text-accent hover:underline">
                    Забыли пароль?
                  </a>
                </div>

                <Button type="submit" loading={isLoading} className="w-full">
                  Войти
                </Button>

                <p className="text-center text-sm text-text-secondary">
                  Нет аккаунта?{' '}
                  <Link to="/register" className="text-accent hover:underline">
                    Зарегистрируйтесь
                  </Link>
                </p>
              </form>
            </Card>

            {/* Benefits */}
            <div className="hidden lg:flex lg:flex-col lg:justify-center h-full">
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Преимущества личного кабинета
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-text-secondary">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
