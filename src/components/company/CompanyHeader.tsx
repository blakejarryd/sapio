import React from 'react'
import { CompanyData } from '../../types/company'
import { ProfitabilityBadge } from './ProfitabilityBadge'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface CompanyHeaderProps {
  company: CompanyData
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="bg-white border-b border-slate-200/60 py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Name and Ticker */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 letter-tight mb-3">
              {company.companyName}
            </h1>
            <div className="flex items-center gap-3 text-slate-600 flex-wrap">
              <span className="text-lg sm:text-xl font-semibold font-mono text-slate-700">{company.ticker}</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-900/5">
                {company.exchange}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-sm sm:text-base text-slate-600">{company.industry}</span>
            </div>
          </div>
          <div className="text-left md:text-right bg-slate-50 rounded-lg px-4 py-3 border border-slate-200/60 shadow-xs min-w-[200px]">
            <div className="text-xs sm:text-sm font-medium text-slate-500 mb-1 letter-wide uppercase">Share Price</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 font-numeric">
              {formatCurrency(company.currentSharePrice, company.currency)}
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              Updated {formatDate(company.lastUpdated)}
            </div>
          </div>
        </div>

        {/* Profitability Badge */}
        <div className="mt-2">
          <ProfitabilityBadge profitability={company.profitability} size="large" />
        </div>
      </div>
    </div>
  )
}
