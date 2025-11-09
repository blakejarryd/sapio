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
  DividendInfo,
  PlainSummary
} from '../components/company'
import { Skeleton, SkeletonChart, SkeletonCard } from '../components/ui'

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
      <div className="min-h-screen bg-slate-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <Skeleton className="h-9 w-3/4 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1 ml-auto" />
                <Skeleton className="h-7 w-24 mb-1 ml-auto" />
                <Skeleton className="h-3 w-32 ml-auto" />
              </div>
            </div>
            <Skeleton className="h-8 w-48 mt-4" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Business Overview Skeleton */}
            <SkeletonCard />

            {/* Chart Skeleton */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <Skeleton className="h-7 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <SkeletonChart className="h-64 sm:h-80 md:h-96" />
            </div>

            {/* Two Column Grid Skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Efficiency Metrics Skeleton */}
            <SkeletonCard />

            {/* Dividend Info Skeleton */}
            <SkeletonCard />

            {/* Summary Skeleton */}
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    window.location.reload()
  }

  if (error || !company || !metrics) {
    const isNotFoundError = error?.includes('404') || error?.includes('not found')
    const isNetworkError = error?.includes('network') || error?.includes('Failed to fetch')

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {isNotFoundError ? 'Company Not Found' : 'Unable to Load Company Data'}
          </h2>

          {/* Error Message */}
          <p className="text-sm text-slate-600 mb-6">
            {isNotFoundError ? (
              <>We couldn't find data for ticker "{ticker?.toUpperCase()}". Please check the ticker symbol and try again.</>
            ) : isNetworkError ? (
              <>There was a problem connecting to the server. Please check your internet connection and try again.</>
            ) : (
              <>{error || 'An unexpected error occurred while loading the company data.'}</>
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isNotFoundError && (
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
            <a
              href="/"
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium inline-block"
            >
              Return to Search
            </a>
          </div>

          {/* Helpful Suggestion */}
          {isNotFoundError && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Available companies:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'CBA', 'BHP', 'CSL', 'WOW', 'A2M'].map(availableTicker => (
                  <a
                    key={availableTicker}
                    href={`/company/${availableTicker}`}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    {availableTicker}
                  </a>
                ))}
              </div>
            </div>
          )}
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

          {/* Dividend Information */}
          <DividendInfo dividends={company.dividends} />

          {/* Plain English Summary */}
          <PlainSummary company={company} metrics={metrics} />
        </div>
      </div>
    </div>
  )
}
