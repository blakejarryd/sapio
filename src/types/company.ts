// Annual financial data point
export interface AnnualFinancials {
  year: number
  revenue: number
  earnings: number  // Net income
  operatingCashFlow: number
  totalAssets: number
  totalLiabilities: number
  shareholderEquity: number
}

// Capital raising event
export interface CapitalRaise {
  date: string
  type: 'IPO' | 'Rights Issue' | 'Placement' | 'Other'
  amountRaised: number
  sharesBefore: number
  sharesAfter: number
  currency: string
}

// Business model information
export interface BusinessModel {
  description: string  // 2-3 sentence overview
  founded: number
  headquarters: string
  employees: number
  markets: string[]  // Geographic markets
  revenueStreams: RevenueStream[]
  keyProducts: Product[]
}

export interface RevenueStream {
  name: string
  description: string
  percentageOfRevenue: number
}

export interface Product {
  name: string
  description: string
}

// Profitability status
export type ProfitabilityStatus =
  | 'profitable'           // Profitable for X consecutive years
  | 'recently-profitable'  // Turned profitable recently
  | 'pre-profit'          // Has revenue, not profitable
  | 'pre-revenue'         // No revenue yet
  | 'intermittent'        // Profitable some years

export interface ProfitabilityInfo {
  status: ProfitabilityStatus
  consecutiveYears?: number  // For 'profitable' status
  profitableSince?: number   // Year turned profitable
  profitableYearsCount?: number  // For 'intermittent' status
  totalYears?: number  // For 'intermittent' status
}

// Cash flow status
export interface CashFlowInfo {
  status: 'generative' | 'neutral' | 'burning'
  fiveYearTotal: number
  currency: string
}

// Company data structure
export interface CompanyData {
  // Basic info
  ticker: string
  companyName: string
  exchange: string
  currency: string
  lastUpdated: string
  sector: string
  industry: string
  currentSharePrice: number
  marketCap: number
  sharesOutstanding: number

  // Business model
  businessModel: BusinessModel

  // Financial history (10 years)
  financials: AnnualFinancials[]

  // Calculated metrics
  profitability: ProfitabilityInfo
  cashFlow: CashFlowInfo

  // Capital structure
  capitalRaises: CapitalRaise[]
  currentDebtToEquity: number
}

// Company search result
export interface CompanySearchResult {
  ticker: string
  companyName: string
  industry: string
  profitabilityStatus: ProfitabilityStatus
}

// Calculated metrics for display
export interface CalculatedMetrics {
  // Growth rates
  revenueCAGR10Y: number
  earningsCAGR10Y: number

  // Profitability
  averageProfitMargin: number
  currentProfitMargin: number

  // Efficiency
  currentROE: number
  averageROE: number

  // Cash flow
  cumulativeCashFlow5Y: number

  // Capital structure
  totalCapitalRaised: number
  dilutionPercentage: number
}
