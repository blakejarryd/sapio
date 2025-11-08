import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface CompanySelectorProps {
  currentTicker: string
  onClose: () => void
}

// Available companies for comparison
const AVAILABLE_COMPANIES = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Cyclical' },
]

export default function CompanySelector({ currentTicker, onClose }: CompanySelectorProps) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter out current company and filter by search term
  const availableCompanies = AVAILABLE_COMPANIES
    .filter(c => c.ticker !== currentTicker)
    .filter(c =>
      c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleSelect = (ticker: string) => {
    navigate(`/compare/${currentTicker}?compare=${ticker}`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-2xl shadow-2xl border border-white/20 p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Compare With</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-gray-900 placeholder-gray-400"
            autoFocus
          />
        </div>

        {/* Company list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No companies found
            </div>
          ) : (
            availableCompanies.map(company => (
              <motion.button
                key={company.ticker}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(company.ticker)}
                className="w-full p-4 rounded-lg bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-primary-300 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {company.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {company.ticker} • {company.sector}
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
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
