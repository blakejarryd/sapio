import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCompanyData } from '../services/api'
import { CompanyData, CalculatedMetrics } from '../types/company'
import { calculateAllMetrics } from '../utils/calculations'
import SearchBar from '../components/SearchBar'
import {
  CompanyHeader,
  BusinessOverview,
  EarningsRevenueChart,
  CashFlowStatus,
  FundingStructure,
  EfficiencyMetrics,
  PlainSummary
} from '../components/company'

export default function CompanyAnalysis() {
  const { ticker } = useParams<{ ticker: string }>()
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompanyData() {
      if (!ticker) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchCompanyData(ticker)
        setCompany(data)

        const calculatedMetrics = calculateAllMetrics(data)
        setMetrics(calculatedMetrics)
      } catch (err) {
        console.error('Error loading company:', err)
        setError('Failed to load company data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyData()
  }, [ticker])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Loading company data...</p>
        </div>
      </div>
    )
  }

  if (error || !company || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-lg text-slate-900 mb-2">Company not found</p>
          <p className="text-sm text-slate-600 mb-6">{error || 'The requested company could not be loaded.'}</p>
          <a href="/" className="text-accent hover:underline">
            Return to search
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Search */}
      <SearchBar isHeader initialValue={`${company.companyName} (${company.ticker})`} />

      {/* Company Header */}
      <CompanyHeader company={company} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Business Overview */}
          <BusinessOverview
            businessModel={company.businessModel}
            currency={company.currency}
          />

          {/* Earnings & Revenue Chart (Hero) */}
          <EarningsRevenueChart
            financials={company.financials}
            currency={company.currency}
            revenueCAGR={metrics.revenueCAGR10Y}
            earningsCAGR={metrics.earningsCAGR10Y}
          />

          {/* Cash Flow and Funding - 2 column grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <CashFlowStatus
              cashFlow={company.cashFlow}
              financials={company.financials}
            />
            <FundingStructure
              debtToEquity={company.currentDebtToEquity}
              capitalRaises={company.capitalRaises}
              currency={company.currency}
            />
          </div>

          {/* Efficiency Metrics */}
          <EfficiencyMetrics financials={company.financials} />

          {/* Plain English Summary */}
          <PlainSummary company={company} metrics={metrics} />
        </div>
      </div>
    </div>
  )
}
