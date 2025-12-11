/**
 * Format a date string to Indonesian locale format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "11 Desember 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format a number to Indonesian Rupiah currency format
 * @param amount - Amount as string or number
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (amount: string | number): string => {
  if (!amount) return '-'
  const numAmount = typeof amount === 'string' ? Number(amount) : amount
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numAmount)
}

/**
 * Format number with Indonesian thousand separators
 * @param value - Number as string
 * @returns Formatted number string (e.g., "1.000.000")
 */
export const formatNumber = (value: string | number): string => {
  if (!value) return ''
  const numValue = typeof value === 'string' ? Number(value) : value
  return numValue.toLocaleString('id-ID')
}

/**
 * Parse formatted number back to raw number string
 * @param formattedValue - Formatted string with separators
 * @returns Raw number string
 */
export const parseFormattedNumber = (formattedValue: string): string => {
  return formattedValue.replace(/\D/g, '')
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns Today's date string
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0]
}
