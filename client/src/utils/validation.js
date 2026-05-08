export function normalizePhoneDigits(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/\D/g, '')
}

export function normalizeRuPhoneDigits(value) {
  // Приводим к формату 11 цифр, начиная с "7"
  const digits = normalizePhoneDigits(value)
  if (!digits) return ''

  const normalized = digits[0] === '8' ? `7${digits.slice(1)}` : digits
  return normalized.slice(0, 11)
}

export function isValidRuPhone(value) {
  const digits = normalizePhoneDigits(value)
  if (!digits) return false
  if (digits.length !== 11) return false
  if (digits[0] !== '7' && digits[0] !== '8') return false
  return true
}

export function formatRuPhone(value) {
  const digits = normalizeRuPhoneDigits(value)
  if (!digits) return ''

  const cc = digits.slice(0, 1) // должно быть '7' (или пусто)
  if (!cc) return ''

  const a = digits.slice(1, 4) // 3 цифры
  const b = digits.slice(4, 7) // 3 цифры
  const c = digits.slice(7, 9) // 2 цифры
  const d = digits.slice(9, 11) // 2 цифры

  // Частичное форматирование по мере ввода
  let out = `+${cc}`
  if (digits.length <= 1) return out

  if (a.length) {
    out += ` (${a}`
    if (a.length === 3) out += ')'
  }

  if (b.length) {
    if (a.length === 3) out += ' '
    out += b
  }

  if (c.length) {
    if (b.length === 3) out += '-'
    out += c
  }

  if (d.length) {
    if (c.length === 2) out += '-'
    out += d
  }

  return out
}

export const phoneFieldRulesRequired = {
  required: 'Введите телефон',
  validate: (value) => isValidRuPhone(value) || 'Введите корректный номер телефона',
}

export const phoneFieldRulesOptional = {
  validate: (value) => {
    if (!value) return true
    return isValidRuPhone(value) || 'Введите корректный номер телефона'
  },
}

