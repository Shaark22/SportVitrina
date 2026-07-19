/** Extract digits from phone input, normalize KZ 8XXXXXXXXXX → 7XXXXXXXXXX. */
export function extractPhoneDigits(input: string): string {
  let digits = String(input || '').replace(/\D/g, '')
  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  return digits.slice(0, 11)
}

/** National number (10 digits) from raw input — handles +7 prefix vs operator codes like 701. */
function getNationalDigits(digits: string): string {
  const d = extractPhoneDigits(digits)
  if (d.startsWith('7') && d.length === 11) {
    return d.slice(1)
  }
  if (d.startsWith('7') && d.length > 10) {
    return d.slice(1, 11)
  }
  return d.slice(0, 10)
}

/** Parse user input into national digits (max 10), with correct backspace handling. */
export function parsePhoneNational(input: string, previousNational = ''): string {
  let digits = String(input || '').replace(/\D/g, '')
  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }

  let national: string

  // Pasted/stored full number: 7 + 10 national digits
  if (digits.length >= 11 && digits.startsWith('7')) {
    national = digits.slice(1, 11)
  } else if (input.includes('+')) {
    // Formatted field shows +7 — leading 7 in digits is country code, not operator digit
    national = digits.startsWith('7') ? digits.slice(1) : digits
  } else {
    // Raw typing (e.g. first digit "7" for 777…) — all digits are national
    national = digits
  }

  national = national.slice(0, 10)

  const prevFormatted = formatKzPhoneFromNational(previousNational)
  if (input.length < prevFormatted.length && national.length === previousNational.length) {
    return previousNational.slice(0, -1)
  }

  return national
}

/** Format national digits for display: +7 XXX XXX XX XX. */
export function formatKzPhoneFromNational(national: string): string {
  const n = national.replace(/\D/g, '').slice(0, 10)
  if (!n) return ''

  const parts = [
    n.slice(0, 3),
    n.slice(3, 6),
    n.slice(6, 8),
    n.slice(8, 10),
  ].filter(Boolean)

  return `+7 ${parts.join(' ')}`
}

/** Live input formatting: +7 XXX XXX XX XX (Kazakhstan). */
export function formatKzPhoneInput(input: string): string {
  return formatKzPhoneFromNational(parsePhoneNational(input))
}

/** Full display from digits (+7 XXX XXX XX XX), used for contacts and completed numbers. */
export function formatKzPhoneDisplay(digits: string): string {
  const national = getNationalDigits(digits)
  if (!national) return ''
  return formatKzPhoneFromNational(national)
}

export function isValidKzPhone(input: string): boolean {
  const national = /^\d+$/.test(input) && input.length <= 10
    ? input
    : getNationalDigits(input)
  return national.length >= 10
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}
