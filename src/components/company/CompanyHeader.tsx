import React from 'react'
import { CompanyData } from '../../types/company'
import { ProfitabilityBadge } from './ProfitabilityBadge'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface CompanyHeaderProps {
  company: CompanyData
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Name and Ticker */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              {company.companyName}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-slate-600 flex-wrap">
              <span className="text-base sm:text-lg font-medium">{company.ticker}</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">
                {company.exchange}
              </span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-sm sm:text-base">{company.industry}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs sm:text-sm text-slate-500">Share Price</div>
            <div className="text-xl sm:text-2xl font-mono text-slate-900">
              {formatCurrency(company.currentSharePrice, company.currency)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Updated {formatDate(company.lastUpdated)}
            </div>
          </div>
        </div>

        {/* Profitability Badge */}
        <div className="mt-4">
          <ProfitabilityBadge profitability={company.profitability} size="large" />
        </div>
      </div>
    </div>
  )
}
