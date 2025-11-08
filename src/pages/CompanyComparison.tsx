import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCompanyData } from '../services/api'
import { CompanyData, MetricKey, METRIC_INFO } from '../types/company'
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters'
import ComparisonChart from '../components/ComparisonChart'

const metricKeys: MetricKey[] = [
  'marketCap',
  'revenue',
  'salesGrowth',
  'netIncome',
  'profitMargin',
  'totalDebt',
  'peRatio',
]

export default function CompanyComparison() {
  const { ticker } = useParams<{ ticker: string }>()
  const [searchParams] = useSearchParams()
  const compareTicker = searchParams.get('compare')
  const navigate = useNavigate()

  const [company1, setCompany1] = useState<CompanyData | null>(null)
  const [company2, setCompany2] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompanies() {
      if (!ticker || !compareTicker) {
        setError('Please select two companies to compare')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const [data1, data2] = await Promise.all([
          fetchCompanyData(ticker),
          fetchCompanyData(compareTicker)
        ])
        setCompany1(data1)
        setCompany2(data2)
      } catch (err) {
        setError('Failed to load company data. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanies()
  }, [ticker, compareTicker])

  const formatMetricValue = (metricKey: MetricKey, value: number, displayValue: string) => {
    if (metricKey === 'peRatio') return displayValue
    if (['salesGrowth', 'profitMargin'].includes(metricKey)) return displayValue
    if (['marketCap', 'revenue', 'netIncome', 'totalDebt'].includes(metricKey)) return displayValue
    return displayValue
  }

  const getComparisonColor = (metric1: number, metric2: number, metricKey: MetricKey) => {
    // For debt, lower is better
    if (metricKey === 'totalDebt') {
      return metric1 < metric2 ? 'text-emerald-600' : metric1 > metric2 ? 'text-red-600' : 'text-gray-700'
    }
    // For most metrics, higher is better
    return metric1 > metric2 ? 'text-emerald-600' : metric1 < metric2 ? 'text-red-600' : 'text-gray-700'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient noise-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading comparison...</p>
        </div>
      </div>
    )
  }

  if (error || !company1 || !company2) {
    return (
      <div className="min-h-screen bg-premium-gradient noise-texture flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="glass rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-2">Error</p>
            <p className="text-gray-700 mb-4">{error || 'Invalid comparison'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-premium-gradient noise-texture">
      {/* Home button */}
      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/30 transition-colors group shadow-lg border border-white/20"
      >
        <svg
          className="w-5 h-5 text-primary-600 group-hover:text-primary-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-sm font-semibold text-gradient hidden sm:inline">SAPIO</span>
      </button>

      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="glass rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
              Company Comparison
            </h1>

            {/* Company headers */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {company1.companyName}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                    {company1.ticker}
                  </span>
                  <span>{company1.exchange}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {company1.sector} • {company1.industry}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {company2.companyName}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {company2.ticker}
                  </span>
                  <span>{company2.exchange}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {company2.sector} • {company2.industry}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {company1.ticker}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {company2.ticker}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metricKeys.map((key, index) => {
                    const metric1 = company1.metrics[key]
                    const metric2 = company2.metrics[key]
                    const info = METRIC_INFO[key]

                    const diff = metric1.value - metric2.value
                    const percentDiff = metric2.value !== 0
                      ? ((diff / Math.abs(metric2.value)) * 100)
                      : 0

                    return (
                      <motion.tr
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{info.label}</div>
                              <div className="text-xs text-gray-500">{metric1.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-center font-semibold text-lg ${getComparisonColor(metric1.value, metric2.value, key)}`}>
                          {metric1.displayValue}
                        </td>
                        <td className={`px-6 py-4 text-center font-semibold text-lg ${getComparisonColor(metric2.value, metric1.value, key)}`}>
                          {metric2.displayValue}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-medium text-gray-700">
                            {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Visual Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl shadow-xl border border-white/20 p-6 mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual Comparison</h2>
            <ComparisonChart
              company1={company1}
              company2={company2}
              metricKeys={metricKeys}
            />
          </motion.div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate(`/company/${company1.ticker}`)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg"
            >
              View {company1.ticker} Dashboard
            </button>
            <button
              onClick={() => navigate(`/company/${company2.ticker}`)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium shadow-lg"
            >
              View {company2.ticker} Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
