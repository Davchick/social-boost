import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { api } from '@/utils/api'

function ProfileForm({ user, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSuccess(false)
    try {
      const result = await api.updateProfile(data)
      onUpdate(result.user)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
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
        label="Email"
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
        label="Телефон"
        type="tel"
        placeholder="+7 (999) 123-45-67"
        {...register('phone')}
      />

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

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSuccess(false)
    try {
      await api.changePassword(data)
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Текущий пароль"
        type="password"
        placeholder="Введите текущий пароль"
        error={errors.currentPassword?.message}
        {...register('currentPassword', { required: 'Введите текущий пароль' })}
      />
      
      <Input
        label="Новый пароль"
        type="password"
        placeholder="Минимум 6 символов"
        error={errors.newPassword?.message}
        {...register('newPassword', { 
          required: 'Введите новый пароль',
          minLength: { value: 6, message: 'Минимум 6 символов' }
        })}
      />
      
      <Input
        label="Повторите новый пароль"
        type="password"
        placeholder="Повторите пароль"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', { 
          required: 'Повторите пароль',
          validate: value => value === newPassword || 'Пароли не совпадают'
        })}
      />

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

function NotificationsForm() {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
        />
        <span className="text-text-primary">Email-уведомления о статусе заказов</span>
      </label>
      
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
        />
        <span className="text-text-primary">SMS-уведомления о важных событиях</span>
      </label>
      
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
        />
        <span className="text-text-primary">Новости и специальные предложения</span>
      </label>
    </div>
  )
}

function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false)

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
        <div className="p-4 bg-error/5 rounded-12">
          <p className="text-sm text-error mb-4">
            Вы уверены? Это действие нельзя отменить. Все ваши данные будут удалены.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="small" onClick={() => setShowConfirm(false)}>
              Отмена
            </Button>
            <Button size="small" className="bg-error hover:bg-error/90">
              Удалить навсегда
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-text-primary">Профиль</h1>

      {/* Profile data */}
      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Личные данные
        </h2>
        <ProfileForm user={user} onUpdate={updateUser} />
      </Card>

      {/* Password */}
      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Смена пароля
        </h2>
        <PasswordForm />
      </Card>

      {/* Notifications */}
      <Card hover={false}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Уведомления
        </h2>
        <NotificationsForm />
      </Card>

      {/* Danger zone */}
      <Card hover={false}>
        <h2 className="text-lg font-semibold text-error mb-4">
          Опасная зона
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Удаление аккаунта приведёт к потере всех данных без возможности восстановления.
        </p>
        <DangerZone />
      </Card>
    </div>
  )
}
