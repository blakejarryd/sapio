export interface HistoricalDataPoint {
  year: number
  value: number
}

export interface Metric {
  value: number
  displayValue: string
  description: string
  historical: HistoricalDataPoint[]
  industryAverage?: number // Optional: industry average for comparison
}

export interface CompanyMetrics {
  marketCap: Metric
  revenue: Metric
  salesGrowth: Metric
  netIncome: Metric
  profitMargin: Metric
  totalDebt: Metric
  peRatio: Metric
}

export interface CompanyData {
  ticker: string
  companyName: string
  exchange: string
  currency: string
  lastUpdated: string
  sector: string // e.g., "Technology", "Healthcare"
  industry: string // e.g., "Consumer Electronics", "Pharmaceuticals"
  metrics: CompanyMetrics
}

export type MetricKey = keyof CompanyMetrics

export interface MetricInfo {
  key: MetricKey
  label: string
  icon: string
}

export const METRIC_INFO: Record<MetricKey, MetricInfo> = {
  marketCap: {
    key: 'marketCap',
    label: 'Company Value',
    icon: '🏢',
  },
  revenue: {
    key: 'revenue',
    label: 'Total Sales',
    icon: '💰',
  },
  salesGrowth: {
    key: 'salesGrowth',
    label: 'Sales Growth',
    icon: '📈',
  },
  netIncome: {
    key: 'netIncome',
    label: 'Profit',
    icon: '✅',
  },
  profitMargin: {
    key: 'profitMargin',
    label: 'Profit Margin',
    icon: '📊',
  },
  totalDebt: {
    key: 'totalDebt',
    label: 'Total Debt',
    icon: '💳',
  },
  peRatio: {
    key: 'peRatio',
    label: 'P/E Ratio',
    icon: '🎯',
  },
}
