import { AnnualFinancials, CashFlowInfo } from '../../types/company'

/**
 * Calculate cash flow status from financial history
 */
export function calculateCashFlowStatus(
  financials: AnnualFinancials[],
  currency: string
): CashFlowInfo {
  // Get last 5 years
  const sorted = [...financials].sort((a, b) => b.year - a.year)
  const lastFiveYears = sorted.slice(0, 5)

  const fiveYearTotal = lastFiveYears.reduce(
    (sum, f) => sum + f.operatingCashFlow,
    0
  )

  let status: 'generative' | 'neutral' | 'burning'

  if (fiveYearTotal > 1000000) {
    // More than $1M positive
    status = 'generative'
  } else if (fiveYearTotal < -1000000) {
    // More than $1M negative
    status = 'burning'
  } else {
    status = 'neutral'
  }

  return {
    status,
    fiveYearTotal,
    currency
  }
}

/**
 * Calculate cumulative cash flow
 */
export function calculateCumulativeCashFlow(financials: AnnualFinancials[]): number {
  return financials.reduce((sum, f) => sum + f.operatingCashFlow, 0)
}
