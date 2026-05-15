import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'
import { phoneFieldRulesOptional } from '@/utils/validation'
import { PhoneInput } from '@/components/common/PhoneInput'

function ProfileForm({ user, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSuccess(false)
    setError('')
    try {
      const result = await api.updateProfile(data)
      onUpdate(result.user)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Не удалось сохранить данные')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Имя"
        placeholder="Ваше имя"
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
            message: 'Некорректный email',
          },
        })}
      />

      <PhoneInput
        name="phone"
        control={control}
        label="Телефон"
        placeholder="+7 (999) 123-45-67"
        rules={phoneFieldRulesOptional}
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" loading={isLoading}>
          Сохранить
        </Button>
        {success && (
          <span className="text-sm text-success">Данные сохранены</span>
        )}
      </div>
    </form>
  )
}

function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSuccess(false)
    setError('')
    try {
      await api.changePassword(data)
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Не удалось сменить пароль')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <PasswordInput
        label="Текущий пароль"
        placeholder="Введите текущий пароль"
        error={errors.currentPassword?.message}
        {...register('currentPassword', { required: 'Введите текущий пароль' })}
      />

      <PasswordInput
        label="Новый пароль"
        placeholder="Минимум 6 символов"
        error={errors.newPassword?.message}
        {...register('newPassword', {
          required: 'Введите новый пароль',
          minLength: { value: 6, message: 'Минимум 6 символов' },
        })}
      />

      <PasswordInput
        label="Повторите новый пароль"
        placeholder="Повторите пароль"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Повторите пароль',
          validate: (value) => value === newPassword || 'Пароли не совпадают',
        })}
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" loading={isLoading}>
          Сменить пароль
        </Button>
        {success && (
          <span className="text-sm text-success">Пароль изменён</span>
        )}
      </div>
    </form>
  )
}

function DangerZone({ onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsLoading(true)
    setError('')
    try {
      await api.deleteAccount()
      onDelete()
    } catch (err) {
      setError(err.message || 'Не удалось удалить аккаунт')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {!showConfirm ? (
        <Button
          variant="ghost"
          className="text-error hover:bg-error/5"
          onClick={() => setShowConfirm(true)}
        >
          Удалить аккаунт
        </Button>
      ) : (
        <div className="p-4 bg-error/5 rounded-12 border border-error/20">
          <p className="text-sm text-error mb-4">
            Вы уверены? Это действие нельзя отменить. Все ваши заявки и данные будут удалены.
          </p>
          {error && <p className="text-sm text-error mb-3">{error}</p>}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                setShowConfirm(false)
                setError('')
              }}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              size="small"
              className="bg-error hover:bg-error/90"
              onClick={handleDelete}
              loading={isLoading}
            >
              Удалить навсегда
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleAccountDeleted = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-text-primary">Профиль</h1>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Личные данные
        </h2>
        <ProfileForm key={user?.id} user={user} onUpdate={updateUser} />
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Смена пароля
        </h2>
        <PasswordForm />
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-semibold text-error mb-4">
          Опасная зона
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Удаление аккаунта приведёт к потере всех данных без возможности восстановления.
        </p>
        <DangerZone onDelete={handleAccountDeleted} />
      </Card>
    </div>
  )
}
