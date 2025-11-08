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
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-600'
}
