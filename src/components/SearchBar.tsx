import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCompanies } from '../services/api'
import { CompanySearchResult } from '../types/company'
import { StatusIndicator } from './ui'

interface SearchBarProps {
  isHeader?: boolean
  initialValue?: string
}

export default function SearchBar({ isHeader = false, initialValue = '' }: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<CompanySearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<CompanySearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [exchangeFilter, setExchangeFilter] = useState<'all' | 'NASDAQ' | 'ASX'>('all')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
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
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query, isFocused, initialValue])

  // Filter results by exchange
  useEffect(() => {
    if (exchangeFilter === 'all') {
      setFilteredResults(results)
    } else {
      setFilteredResults(results.filter(company => company.exchange === exchangeFilter))
    }
    setSelectedIndex(-1)
  }, [results, exchangeFilter])

  const handleSelectCompany = (ticker: string) => {
    setShowResults(false)
    setIsFocused(false)
    navigate(`/company/${ticker}`)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (isHeader && query === initialValue) {
      setQuery('')
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
      setShowResults(false)
      if (isHeader && query === '') {
        setQuery(initialValue)
      }
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || filteredResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < filteredResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
          handleSelectCompany(filteredResults[selectedIndex].ticker)
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'profitable':
        return 'Profitable'
      case 'recently-profitable':
        return 'Recently Profitable'
      case 'pre-profit':
        return 'Pre-profit'
      case 'pre-revenue':
        return 'Pre-revenue'
      case 'intermittent':
        return 'Intermittent'
      default:
        return ''
    }
  }

  const getStatusType = (status: string): 'profitable' | 'warning' | 'caution' => {
    switch (status) {
      case 'profitable':
      case 'recently-profitable':
        return 'profitable'
      case 'pre-profit':
      case 'intermittent':
        return 'warning'
      case 'pre-revenue':
        return 'caution'
      default:
        return 'caution'
    }
  }

  return (
    <div
      className={`w-full ${
        isHeader
          ? 'bg-white border-b border-slate-200 shadow-sm'
          : 'max-w-2xl'
      }`}
    >
      <div className={`${isHeader ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4' : ''}`}>
        <div className="relative">
          {!isHeader && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
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
            onKeyDown={handleKeyDown}
            placeholder="Search by company name or ticker..."
            className={`w-full transition-colors ${
              isHeader
                ? 'px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent'
                : 'pl-12 pr-6 py-4 text-lg bg-white border-2 border-slate-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20'
            } focus:outline-none placeholder:text-slate-400`}
            autoFocus={!isHeader}
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && results.length > 0 && (
          <div
            className={`absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 ${
              isHeader ? 'max-w-7xl mx-auto' : ''
            }`}
          >
            {/* Exchange Filter */}
            {results.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-600 font-medium">Filter by exchange:</span>
                <div className="flex gap-1">
                  {(['all', 'NASDAQ', 'ASX'] as const).map((exchange) => (
                    <button
                      key={exchange}
                      onClick={() => setExchangeFilter(exchange)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        exchangeFilter === exchange
                          ? 'bg-slate-900 text-white font-medium'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {exchange === 'all' ? 'All' : exchange}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((company, index) => (
                  <button
                    key={company.ticker}
                    onClick={() => handleSelectCompany(company.ticker)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b border-slate-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-accent/10' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {company.companyName} ({company.ticker})
                          </span>
                          <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">
                            {company.exchange}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">{company.industry}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator type={getStatusType(company.profitabilityStatus)} />
                        <span className="text-xs text-slate-500">
                          {getStatusText(company.profitabilityStatus)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No companies found for {exchangeFilter} exchange
                </div>
              )}
            </div>
          </div>
        )}

        {showResults && results.length === 0 && !isLoading && (
          <div className="absolute left-0 right-0 mt-2 p-4 text-center bg-white border border-slate-200 rounded-lg shadow-lg text-slate-500">
            No companies found
          </div>
        )}
      </div>
    </div>
  )
}
