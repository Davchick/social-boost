import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShoppingCart, Clock, Repeat } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'
import { phoneFieldRulesRequired } from '@/utils/validation'
import { PhoneInput } from '@/components/common/PhoneInput'

const benefits = [
  { icon: ShoppingCart, text: 'Отслеживание статуса заказов в реальном времени' },
  { icon: Clock, text: 'Полная история всех ваших проектов' },
  { icon: Repeat, text: 'Быстрое оформление повторных заказов' },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    try {
      const result = await api.register(data)
      login(result.user, result.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section className="min-h-[calc(100vh-80px)] flex items-center">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Form */}
            <Card hover={false}>
              <h1 className="text-2xl font-semibold text-text-primary mb-6">
                Создать аккаунт
              </h1>

              {error && (
                <div className="mb-4 p-3 bg-error/10 text-error rounded-12 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                <PhoneInput
                  name="phone"
                  control={control}
                  label="Телефон *"
                  placeholder="+7 (999) 123-45-67"
                  rules={phoneFieldRulesRequired}
                />
                
                <div className="relative">
                  <Input
                    label="Пароль *"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Минимум 6 символов"
                    error={errors.password?.message}
                    {...register('password', { 
                      required: 'Введите пароль',
                      minLength: { value: 6, message: 'Минимум 6 символов' }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <Input
                  label="Повторите пароль *"
                  type="password"
                  placeholder="Повторите пароль"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', { 
                    required: 'Повторите пароль',
                    validate: value => value === password || 'Пароли не совпадают'
                  })}
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
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
                  Зарегистрироваться
                </Button>

                <p className="text-center text-sm text-text-secondary">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" className="text-accent hover:underline">
                    Войдите
                  </Link>
                </p>
              </form>
            </Card>

            {/* Benefits */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Что даёт регистрация
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
