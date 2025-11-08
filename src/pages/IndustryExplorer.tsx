import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCompanyData } from '../services/api'
import { CompanyData } from '../types/company'

interface IndustryGroup {
  sector: string
  companies: CompanyData[]
  avgRevenue: number
  avgProfitMargin: number
  avgPeRatio: number
}

const ALL_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

export default function IndustryExplorer() {
  const navigate = useNavigate()
  const [industries, setIndustries] = useState<IndustryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  useEffect(() => {
    async function loadIndustries() {
      setIsLoading(true)
      try {
        // Load all companies
        const companies = await Promise.all(
          ALL_TICKERS.map(ticker => fetchCompanyData(ticker))
        )

        // Group by sector
        const grouped = companies.reduce((acc, company) => {
          if (!acc[company.sector]) {
            acc[company.sector] = []
          }
          acc[company.sector].push(company)
          return acc
        }, {} as Record<string, CompanyData[]>)

        // Calculate averages per sector
        const industryGroups: IndustryGroup[] = Object.entries(grouped).map(([sector, companies]) => {
          const avgRevenue = companies.reduce((sum, c) => sum + c.metrics.revenue.value, 0) / companies.length
          const avgProfitMargin = companies.reduce((sum, c) => sum + c.metrics.profitMargin.value, 0) / companies.length
          const avgPeRatio = companies.reduce((sum, c) => sum + c.metrics.peRatio.value, 0) / companies.length

          return {
            sector,
            companies,
            avgRevenue,
            avgProfitMargin,
            avgPeRatio
          }
        })

        setIndustries(industryGroups.sort((a, b) => b.avgRevenue - a.avgRevenue))
      } catch (err) {
        console.error('Failed to load industries:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadIndustries()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient noise-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading industries...</p>
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
          <div className="glass rounded-2xl shadow-xl border border-white/20 p-8 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Industry Explorer
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare companies across different sectors and discover industry trends. See how different sectors perform on key metrics.
            </p>
          </div>

          {/* Industry Cards */}
          <div className="space-y-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.sector}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Sector Header */}
                <button
                  onClick={() => setSelectedSector(selectedSector === industry.sector ? null : industry.sector)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {industry.sector.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900">{industry.sector}</h2>
                      <p className="text-sm text-gray-600">{industry.companies.length} companies</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Profit Margin</div>
                      <div className="text-lg font-semibold text-gray-900">{industry.avgProfitMargin.toFixed(1)}%</div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg P/E Ratio</div>
                      <div className="text-lg font-semibold text-gray-900">{industry.avgPeRatio.toFixed(1)}</div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${selectedSector === industry.sector ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Company List (Expanded) */}
                {selectedSector === industry.sector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6 space-y-3">
                      {industry.companies.map(company => (
                        <motion.button
                          key={company.ticker}
                          whileHover={{ scale: 1.01, x: 4 }}
                          onClick={() => navigate(`/company/${company.ticker}`)}
                          className="w-full p-4 rounded-lg bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-primary-300 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                                  {company.ticker}
                                </span>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {company.companyName}
                                </h3>
                              </div>
                              <div className="text-sm text-gray-600">{company.industry}</div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
                                <div className={`font-semibold ${
                                  company.metrics.profitMargin.value > industry.avgProfitMargin
                                    ? 'text-emerald-600'
                                    : 'text-gray-700'
                                }`}>
                                  {company.metrics.profitMargin.displayValue}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">P/E Ratio</div>
                                <div className="font-semibold text-gray-700">
                                  {company.metrics.peRatio.displayValue}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                                <div className="font-semibold text-gray-700">
                                  {company.metrics.revenue.displayValue}
                                </div>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
