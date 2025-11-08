import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { searchCompanies, CompanySearchResult } from '../services/api'

interface SearchBarProps {
  isHeader?: boolean
  initialValue?: string
}

export default function SearchBar({ isHeader = false, initialValue = '' }: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<CompanySearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      // Only search if focused and query changed from initial value
      if (query.trim().length > 0 && isFocused && query !== initialValue) {
        setIsLoading(true)
        try {
          const companies = await searchCompanies(query)
          setResults(companies)
          setShowResults(true)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // Debounce search

    return () => clearTimeout(searchTimeout)
  }, [query, isFocused, initialValue])

  const handleSelectCompany = (ticker: string) => {
    setShowResults(false)
    setIsFocused(false)
    navigate(`/company/${ticker}`)
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Clear initial value when focused in header mode
    if (isHeader && query === initialValue) {
      setQuery('')
    }
  }

  const handleBlur = () => {
    // Delay to allow click on results
    setTimeout(() => {
      setIsFocused(false)
      setShowResults(false)
      // Restore initial value if empty in header mode
      if (isHeader && query === '') {
        setQuery(initialValue)
      }
    }, 200)
  }

  return (
    <motion.div
      layout
      layoutId="search-bar"
      className={`w-full ${
        isHeader
          ? 'fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 shadow-lg'
          : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md'
      }`}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={`${isHeader ? 'pl-32 pr-4 py-3 max-w-3xl mx-auto' : 'px-6 py-4'}`}>
        <motion.div
          className="relative"
          whileHover={!isHeader ? { scale: 1.02 } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* Search Icon */}
          {!isHeader && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search for a company..."
            className={`w-full transition-all duration-300 ${
              isHeader
                ? 'px-4 py-2 text-sm bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:border-primary-400 focus:bg-white/70 shadow-sm hover:bg-white/60'
                : 'pl-14 pr-6 py-5 text-lg glass glow rounded-2xl border-0 focus:ring-2 focus:ring-primary-400 focus:glow placeholder:text-gray-500 font-medium shadow-xl hover:shadow-2xl'
            } ${!isHeader && query.length === 0 ? 'breathe' : ''} focus:outline-none placeholder:text-gray-500`}
            autoFocus={!isHeader}
          />
          {isLoading && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          )}
        </motion.div>

        {/* Search Results Dropdown */}
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto z-10 ${
              isHeader
                ? 'bg-white border border-gray-200 rounded-lg shadow-lg'
                : 'glass rounded-2xl shadow-xl border border-white/20'
            }`}
          >
            {results.map((company, index) => (
              <motion.button
                key={company.ticker}
                onClick={() => handleSelectCompany(company.ticker)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full px-5 py-3 text-left transition-all border-b last:border-b-0 ${
                  isHeader
                    ? 'hover:bg-gray-50 border-gray-100'
                    : 'hover:bg-white/40 border-white/10 backdrop-blur-sm'
                }`}
              >
                <div className="font-semibold text-gray-900">{company.ticker}</div>
                <div className="text-sm text-gray-600">{company.companyName}</div>
                <div className="text-xs text-gray-500">{company.exchange}</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {showResults && results.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute left-0 right-0 mt-2 p-4 text-center ${
              isHeader
                ? 'bg-white border border-gray-200 rounded-lg shadow-lg text-gray-500'
                : 'glass rounded-2xl shadow-xl text-gray-600 font-medium'
            }`}
          >
            No companies found
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
