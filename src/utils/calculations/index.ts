export * from './growth'
export * from './profitability'
export * from './efficiency'
export * from './cashflow'

import { CompanyData, CalculatedMetrics } from '../../types/company'
import { calculateCAGR } from './growth'
import { calculateProfitMargin, calculateAverageProfitMargin } from './profitability'
import { calculateROE, calculateAverageROE } from './efficiency'

/**
 * Calculate all metrics for a company
 */
export function calculateAllMetrics(company: CompanyData): CalculatedMetrics {
  const financials = company.financials
  const sorted = [...financials].sort((a, b) => a.year - b.year)

  // Get 10-year period
  const firstYear = sorted[0]
  const lastYear = sorted[sorted.length - 1]
  const years = sorted.length - 1

  // Get last 5 years for cash flow
  const lastFiveYears = [...financials]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5)

  // Calculate growth rates
  const revenueCAGR10Y = calculateCAGR(firstYear.revenue, lastYear.revenue, years)

  let earningsCAGR10Y = 0
  if (firstYear.earnings > 0 && lastYear.earnings > 0) {
    earningsCAGR10Y = calculateCAGR(firstYear.earnings, lastYear.earnings, years)
  }

  // Calculate profitability metrics
  const currentProfitMargin = calculateProfitMargin(lastYear.revenue, lastYear.earnings)
  const averageProfitMargin = calculateAverageProfitMargin(financials)

  // Calculate efficiency metrics
  const currentROE = calculateROE(lastYear.earnings, lastYear.shareholderEquity)
  const averageROE = calculateAverageROE(financials)

  // Calculate cash flow
  const cumulativeCashFlow5Y = lastFiveYears.reduce(
    (sum, f) => sum + f.operatingCashFlow,
    0
  )

  // Calculate capital structure
  const totalCapitalRaised = company.capitalRaises.reduce(
    (sum, raise) => sum + raise.amountRaised,
    0
  )

  let dilutionPercentage = 0
  if (company.capitalRaises.length > 0) {
    const firstRaise = company.capitalRaises[0]
    const sharesAdded = company.sharesOutstanding - (firstRaise.sharesBefore || 0)
    dilutionPercentage = (sharesAdded / company.sharesOutstanding) * 100
  }

  return {
    revenueCAGR10Y,
    earningsCAGR10Y,
    averageProfitMargin,
    currentProfitMargin,
    currentROE,
    averageROE,
    cumulativeCashFlow5Y,
    totalCapitalRaised,
    dilutionPercentage
  }
}
