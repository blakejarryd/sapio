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
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
            className={`absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 ${
              isHeader ? 'max-w-7xl mx-auto' : ''
            }`}
          >
            {results.map((company) => (
              <button
                key={company.ticker}
                onClick={() => handleSelectCompany(company.ticker)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {company.companyName} ({company.ticker})
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
            ))}
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
