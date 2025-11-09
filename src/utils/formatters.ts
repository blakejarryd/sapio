/**
 * Format large numbers into readable format (K, M, B, T)
 */
export function formatNumber(value: number): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(1)}T`
  }
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(1)}B`
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(1)}M`
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(1)}K`
  }
  return `${sign}${absValue.toFixed(0)}`
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatted = formatNumber(value)
  return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/**
 * Format year for chart display
 */
export function formatYear(year: number): string {
  return year.toString()
}

/**
 * Get color for growth values
 */
export function getGrowthColor(value: number): string {
  if (value > 0) return 'text-profit'
  if (value < 0) return 'text-loss'
  return 'text-slate-600'
}

/**
 * Format large currency with full precision for display
 */
export function formatCurrencyFull(value: number, currency: string = 'USD'): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  const symbol = currency === 'USD' ? '$' : currency + ' '

  if (absValue >= 1_000_000_000) {
    return `${sign}${symbol}${(absValue / 1_000_000_000).toFixed(2)}B`
  }
  if (absValue >= 1_000_000) {
    return `${sign}${symbol}${(absValue / 1_000_000).toFixed(2)}M`
  }
  if (absValue >= 1_000) {
    return `${sign}${symbol}${(absValue / 1_000).toFixed(2)}K`
  }

  return `${sign}${symbol}${absValue.toLocaleString()}`
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
