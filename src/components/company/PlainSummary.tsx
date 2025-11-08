import React from 'react'
import { CompanyData, CalculatedMetrics } from '../../types/company'
import { Card } from '../ui'
import { formatCurrency } from '../../utils/formatters'

interface PlainSummaryProps {
  company: CompanyData
  metrics: CalculatedMetrics
}

export const PlainSummary: React.FC<PlainSummaryProps> = ({
  company,
  metrics
}) => {
  const generateAssessment = (): { icon: string; text: string; type: 'positive' | 'warning' | 'negative' }[] => {
    const items: { icon: string; text: string; type: 'positive' | 'warning' | 'negative' }[] = []

    // Profitability assessment
    if (company.profitability.status === 'profitable') {
      items.push({
        icon: '✓',
        text: `This company has been profitable for ${company.profitability.consecutiveYears} consecutive years`,
        type: 'positive'
      })
    } else if (company.profitability.status === 'recently-profitable') {
      items.push({
        icon: '✓',
        text: `Turned profitable in ${company.profitability.profitableSince}`,
        type: 'positive'
      })
    } else if (company.profitability.status === 'pre-profit') {
      items.push({
        icon: '⚠',
        text: 'This company is not yet profitable (has revenue but operating at a loss)',
        type: 'warning'
      })
    } else if (company.profitability.status === 'pre-revenue') {
      items.push({
        icon: '⚠',
        text: 'This company is in pre-revenue stage (no sales yet)',
        type: 'negative'
      })
    } else if (company.profitability.status === 'intermittent') {
      items.push({
        icon: '⚠',
        text: `Profitable in ${company.profitability.profitableYearsCount} of last ${company.profitability.totalYears} years (inconsistent profitability)`,
        type: 'warning'
      })
    }

    // Revenue growth assessment
    if (metrics.revenueCAGR10Y > 0) {
      items.push({
        icon: '✓',
        text: `Revenue has grown ${metrics.revenueCAGR10Y.toFixed(0)}% annually over the last decade`,
        type: 'positive'
      })
    } else if (metrics.revenueCAGR10Y < 0) {
      items.push({
        icon: '⚠',
        text: `Revenue has declined ${Math.abs(metrics.revenueCAGR10Y).toFixed(0)}% annually over the last decade`,
        type: 'negative'
      })
    }

    // Earnings growth assessment
    if (metrics.earningsCAGR10Y > 0 && company.profitability.status === 'profitable') {
      items.push({
        icon: '✓',
        text: `Earnings have grown ${metrics.earningsCAGR10Y.toFixed(0)}% annually`,
        type: 'positive'
      })
    }

    // Cash flow assessment
    if (company.cashFlow.status === 'generative') {
      const amount = formatCurrency(company.cashFlow.fiveYearTotal, company.currency)
      items.push({
        icon: '✓',
        text: `The business generates positive cash flow (${amount} over 5 years)`,
        type: 'positive'
      })
    } else if (company.cashFlow.status === 'burning') {
      const amount = formatCurrency(Math.abs(company.cashFlow.fiveYearTotal), company.currency)
      items.push({
        icon: '⚠',
        text: `Has burned ${amount} in cash over the last 5 years`,
        type: 'negative'
      })
    }

    // Debt assessment
    if (company.currentDebtToEquity <= 0.3) {
      items.push({
        icon: '✓',
        text: `Uses conservative debt (${(company.currentDebtToEquity * 100).toFixed(0)}% of capital structure)`,
        type: 'positive'
      })
    } else if (company.currentDebtToEquity <= 0.6) {
      items.push({
        icon: '✓',
        text: `Uses moderate debt (${(company.currentDebtToEquity * 100).toFixed(0)}% of capital structure)`,
        type: 'positive'
      })
    } else {
      items.push({
        icon: '⚠',
        text: `Highly leveraged (${(company.currentDebtToEquity * 100).toFixed(0)}% debt)`,
        type: 'warning'
      })
    }

    // Capital raising assessment
    if (company.capitalRaises.length === 0) {
      items.push({
        icon: '✓',
        text: 'No equity capital raised (self-funded growth)',
        type: 'positive'
      })
    } else if (company.capitalRaises.length <= 2) {
      const total = formatCurrency(metrics.totalCapitalRaised, company.currency)
      items.push({
        icon: '✓',
        text: `Raised ${total} in equity capital across ${company.capitalRaises.length} rounds`,
        type: 'positive'
      })
    } else {
      const total = formatCurrency(metrics.totalCapitalRaised, company.currency)
      items.push({
        icon: '⚠',
        text: `Raised ${total} in equity capital across ${company.capitalRaises.length} rounds (frequent capital raising)`,
        type: 'warning'
      })
    }

    // ROE assessment
    if (metrics.currentROE >= 15) {
      items.push({
        icon: '✓',
        text: `Returns ${metrics.currentROE.toFixed(1)}% on shareholder equity (above 15% is excellent)`,
        type: 'positive'
      })
    } else if (metrics.currentROE >= 10) {
      items.push({
        icon: '✓',
        text: `Returns ${metrics.currentROE.toFixed(1)}% on shareholder equity (solid performance)`,
        type: 'positive'
      })
    } else if (metrics.currentROE > 0) {
      items.push({
        icon: '⚠',
        text: `Returns ${metrics.currentROE.toFixed(1)}% on shareholder equity (below 10% is modest)`,
        type: 'warning'
      })
    }

    // Risk warning for pre-profit companies
    if (company.profitability.status === 'pre-profit' || company.profitability.status === 'pre-revenue') {
      items.push({
        icon: '⚠',
        text: 'High-risk investment dependent on achieving profitability',
        type: 'negative'
      })
    }

    return items
  }

  const assessment = generateAssessment()

  return (
    <Card className="col-span-full">
      <h3 className="text-h2 text-slate-900 mb-4">Company Assessment</h3>

      <div className="space-y-3">
        {assessment.map((item, index) => {
          const colorClass =
            item.type === 'positive'
              ? 'text-profit'
              : item.type === 'warning'
              ? 'text-status-warning'
              : 'text-loss'

          return (
            <div key={index} className="flex items-start gap-3">
              <span className={`text-lg font-semibold ${colorClass} flex-shrink-0`}>
                {item.icon}
              </span>
              <p className="text-base text-slate-700 leading-relaxed">{item.text}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          This assessment is based on historical financial data and does not constitute
          investment advice. Always conduct your own research and consider seeking advice
          from a qualified financial advisor.
        </p>
      </div>
    </Card>
  )
}
