import { AnnualFinancials, ProfitabilityInfo, ProfitabilityStatus } from '../../types/company'

/**
 * Calculate profitability status from financial history
 */
export function calculateProfitabilityStatus(
  financials: AnnualFinancials[]
): ProfitabilityInfo {
  if (financials.length === 0) {
    return {
      status: 'pre-revenue'
    }
  }

  // Sort by year descending
  const sorted = [...financials].sort((a, b) => b.year - a.year)

  // Check if pre-revenue (no revenue in most recent year)
  if (sorted[0].revenue <= 0) {
    return {
      status: 'pre-revenue'
    }
  }

  // Check current profitability
  const currentlyProfitable = sorted[0].earnings > 0

  if (!currentlyProfitable) {
    return {
      status: 'pre-profit'
    }
  }

  // Count consecutive profitable years from most recent
  let consecutiveYears = 0
  for (const year of sorted) {
    if (year.earnings > 0) {
      consecutiveYears++
    } else {
      break
    }
  }

  // Find year turned profitable
  let profitableSince: number | undefined
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].earnings > 0) {
      profitableSince = sorted[i].year
      break
    }
  }

  // Count total profitable years
  const profitableYearsCount = financials.filter(f => f.earnings > 0).length
  const totalYears = financials.length

  // Determine status
  let status: ProfitabilityStatus

  if (consecutiveYears >= 3) {
    status = 'profitable'
  } else if (consecutiveYears >= 1 && consecutiveYears < 3) {
    status = 'recently-profitable'
  } else if (profitableYearsCount > 0 && profitableYearsCount < totalYears) {
    status = 'intermittent'
  } else {
    status = 'pre-profit'
  }

  return {
    status,
    consecutiveYears: status === 'profitable' ? consecutiveYears : undefined,
    profitableSince,
    profitableYearsCount: status === 'intermittent' ? profitableYearsCount : undefined,
    totalYears: status === 'intermittent' ? totalYears : undefined
  }
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(revenue: number, earnings: number): number {
  if (revenue <= 0) return 0
  return Math.round((earnings / revenue) * 1000) / 10
}

/**
 * Calculate average profit margin over time
 */
export function calculateAverageProfitMargin(financials: AnnualFinancials[]): number {
  const profitableYears = financials.filter(f => f.earnings > 0)

  if (profitableYears.length === 0) return 0

  const totalMargin = profitableYears.reduce((sum, f) => {
    return sum + calculateProfitMargin(f.revenue, f.earnings)
  }, 0)

  return Math.round((totalMargin / profitableYears.length) * 10) / 10
}
