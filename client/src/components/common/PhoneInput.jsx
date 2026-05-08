import { useMemo } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/utils/cn'
import { formatRuPhone, normalizeRuPhoneDigits } from '@/utils/validation'

function isAllowedControlKey(key) {
  return (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'Tab' ||
    key === 'Enter' ||
    key === 'Escape' ||
    key === 'Home' ||
    key === 'End' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'ArrowUp' ||
    key === 'ArrowDown'
  )
}

export function PhoneInput({
  name,
  control,
  label,
  placeholder,
  rules,
  className,
}) {
  const {
    field,
    fieldState,
  } = useController({
    name,
    control,
    rules,
  })

  const value = useMemo(() => field.value || '', [field.value])

  const errorMessage = fieldState.error?.message

  const handleKeyDown = (e) => {
    // Разрешаем системные комбинации: copy/paste/undo и т.п.
    if (e.ctrlKey || e.metaKey || e.altKey) return

    if (isAllowedControlKey(e.key)) return

    // Разрешаем ввод цифр и плюса (плюс будет отфильтрован при нормализации).
    // Важно: иногда цифровые клавиши с Numpad приходят как `Numpad1` вместо обычной `1`,
    // и текущая проверка через /^\d$/ ломает ввод. Поэтому извлекаем цифру из `key` или `code`.
    const digit =
      (/^\d$/.test(e.key) && e.key) ||
      (/^Numpad\d$/.test(e.key) && e.key.replace('Numpad', '')) ||
      (/^Digit\d$/.test(e.code) && e.code.replace('Digit', '')) ||
      (/^Numpad\d$/.test(e.code) && e.code.replace('Numpad', ''))

    if (digit !== null && digit !== '') {
      const alreadyDigits = normalizeRuPhoneDigits(value).length
      // Если ввод только начался — первая цифра должна быть 7/8.
      if (alreadyDigits === 0 && digit !== '7' && digit !== '8') {
        e.preventDefault()
      }
      return
    }
    if (e.key === '+') return

    e.preventDefault()
  }

  const applySanitizeAndFormat = (raw) => {
    const normalizedDigits = normalizeRuPhoneDigits(raw)
    // Российский номер всегда начинается с 7 (после нормализации 8->7)
    if (!normalizedDigits) return ''
    if (normalizedDigits[0] !== '7') return ''
    return formatRuPhone(normalizedDigits)
  }

  const handleChange = (e) => {
    const formatted = applySanitizeAndFormat(e.target.value)
    field.onChange(formatted)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text') || ''
    const formatted = applySanitizeAndFormat(text)
    field.onChange(formatted)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        inputMode="tel"
        autoComplete="tel"
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 rounded-lg border border-border bg-secondary text-text-primary',
          'placeholder:text-text-muted',
          'focus:outline-none focus:border-accent',
          'transition-colors duration-200',
          errorMessage && 'border-error focus:border-error',
          className
        )}
      />
      {errorMessage && (
        <p className="mt-2 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  )
}

