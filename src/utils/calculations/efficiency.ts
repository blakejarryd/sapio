import { AnnualFinancials } from '../../types/company'

/**
 * Calculate Return on Equity (ROE)
 * @param earnings - Net income
 * @param shareholderEquity - Shareholder equity
 * @returns ROE as a percentage
 */
export function calculateROE(earnings: number, shareholderEquity: number): number {
  if (shareholderEquity <= 0) return 0

  const roe = (earnings / shareholderEquity) * 100
  return Math.round(roe * 10) / 10
}

/**
 * Calculate average ROE over time
 */
export function calculateAverageROE(financials: AnnualFinancials[]): number {
  const validYears = financials.filter(
    f => f.shareholderEquity > 0 && f.earnings > 0
  )

  if (validYears.length === 0) return 0

  const totalROE = validYears.reduce((sum, f) => {
    return sum + calculateROE(f.earnings, f.shareholderEquity)
  }, 0)

  return Math.round((totalROE / validYears.length) * 10) / 10
}

/**
 * Calculate debt to equity ratio
 */
export function calculateDebtToEquity(
  totalLiabilities: number,
  shareholderEquity: number
): number {
  if (shareholderEquity <= 0) return 0

  const ratio = totalLiabilities / shareholderEquity
  return Math.round(ratio * 100) / 100
}
