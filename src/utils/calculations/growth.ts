/**
 * Calculate Compound Annual Growth Rate (CAGR)
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param years - Number of years
 * @returns CAGR as a percentage
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) {
    return 0
  }

  const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100
  return Math.round(cagr * 10) / 10
}

/**
 * Calculate year-over-year growth rate
 * @param currentValue - Current period value
 * @param previousValue - Previous period value
 * @returns YoY growth as a percentage
 */
export function calculateYoYGrowth(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0

  const growth = ((currentValue - previousValue) / Math.abs(previousValue)) * 100
  return Math.round(growth * 10) / 10
}
