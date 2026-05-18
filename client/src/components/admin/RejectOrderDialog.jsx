import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Textarea } from '@/components/common/Textarea'

export function RejectOrderDialog({ orderId, open, loading, submitError, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setReason('')
      setError('')
    }
  }, [open])

  if (!open) return null

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('Укажите причину')
      return
    }
    onConfirm(trimmed)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-order-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-primary shadow-card p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="reject-order-title" className="text-lg font-semibold text-text-primary">
              Отклонить заявку #{orderId}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Укажите, почему агентство не может взяться за проект. Клиент увидит эту причину.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-secondary"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <p className="text-sm text-error" role="alert">
              {submitError}
            </p>
          )}
          <Textarea
            label="Причина отклонения"
            placeholder="Например: нет свободных ресурсов в выбранном регионе"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value)
              if (error) setError('')
            }}
            error={error}
            rows={4}
            maxLength={500}
            disabled={loading}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="small" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" size="small" className="bg-error hover:bg-error/90" loading={loading}>
              Отклонить заявку
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
