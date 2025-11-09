import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { DividendInfo as DividendData } from '../../types/company'
import { Card, TooltipLabel, StatusIndicator } from '../ui'
import { tooltipContent } from '../../utils/tooltipContent'

interface DividendInfoProps {
  dividends: DividendData
}

export const DividendInfo: React.FC<DividendInfoProps> = ({
  dividends
}) => {
  if (!dividends.paysDividend) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <StatusIndicator type="warning" size={12} className="mt-1" />
          <div>
            <h3 className="text-h3 text-slate-900 mb-2">Dividend Information</h3>
            <p className="text-sm text-slate-700 mb-3">
              This company does not currently pay dividends to shareholders.
            </p>
            <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3 text-sm">
              <p className="text-amber-900 font-medium mb-1">Reinvestment Strategy</p>
              <p className="text-amber-800">
                Like a property under renovation, this company reinvests profits back into the business for growth rather than distributing them as dividends. This is common for growth-focused companies.
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Sort dividend history by year
  const sortedDividends = [...dividends.dividendHistory].sort((a, b) => a.year - b.year)

  // Prepare chart data
  const chartData = sortedDividends.map(d => ({
    year: d.year.toString(),
    dividend: d.dividendPerShare
  }))

  const formatDividend = (value: number) => {
    const symbol = dividends.currency === 'USD' ? '$' :
                   dividends.currency === 'AUD' ? 'A$' :
                   dividends.currency + ' '
    return `${symbol}${value.toFixed(2)}`
  }

  const getYieldStatus = (): { label: string; type: 'profitable' | 'warning' | 'caution' } => {
    const yield_ = dividends.currentYield || 0
    if (yield_ >= 4) return { label: 'High Yield', type: 'profitable' }
    if (yield_ >= 2) return { label: 'Moderate Yield', type: 'profitable' }
    if (yield_ >= 1) return { label: 'Low Yield', type: 'warning' }
    return { label: 'Very Low Yield', type: 'warning' }
  }

  const yieldStatus = getYieldStatus()

  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
            Shareholder Income
          </h3>
          <p className="text-sm text-slate-600">
            Dividend payments to shareholders (like rental income from property)
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Dividend Yield */}
        <div>
          <TooltipLabel
            label="Dividend Yield"
            tooltip={tooltipContent.dividendYield}
            className="text-sm text-slate-600 mb-2 font-medium"
          />
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-mono font-bold text-profit font-numeric letter-tight">
              {(dividends.currentYield || 0).toFixed(2)}%
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${
              yieldStatus.type === 'profitable' ? 'bg-profit-50 text-profit-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {yieldStatus.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Annual dividend income per dollar invested
          </p>
        </div>

        {/* Payout Ratio */}
        <div>
          <TooltipLabel
            label="Payout Ratio"
            tooltip={tooltipContent.payoutRatio}
            className="text-sm text-slate-600 mb-2 font-medium"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-slate-900 font-numeric letter-tight">
              {(dividends.payoutRatio || 0).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {dividends.payoutRatio && dividends.payoutRatio < 70
              ? 'Conservative - room for growth'
              : 'High - less room for increases'}
          </p>
        </div>

        {/* Consecutive Years */}
        <div>
          <TooltipLabel
            label="Payment History"
            tooltip={tooltipContent.dividendConsistency}
            className="text-sm text-slate-600 mb-2 font-medium"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-slate-900 font-numeric letter-tight">
              {dividends.consecutiveYears || 0}
            </span>
            <span className="text-base text-slate-600">years</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Consecutive years of dividend payments
          </p>
        </div>
      </div>

      {/* Dividend History Chart */}
      <div className="mb-4">
        <TooltipLabel
          label="10-Year Dividend History"
          tooltip={tooltipContent.dividendGrowth}
          className="text-base font-semibold text-slate-900 mb-4"
        />
        <div className="h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatDividend}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                width={60}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number
                    return (
                      <div className="bg-white border border-slate-200/60 rounded-lg px-3 py-2 shadow-elevated">
                        <div className="text-xs text-slate-600 mb-1">
                          {payload[0].payload.year}
                        </div>
                        <div className="text-sm font-bold font-mono font-numeric text-profit">
                          {formatDividend(value)} / share
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              />
              <Bar
                dataKey="dividend"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Rate */}
      {dividends.dividendGrowthCAGR !== undefined && (
        <div className="bg-profit-50 border border-profit-200/60 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-profit-700 mb-1">
                Dividend Growth (10-year CAGR)
              </p>
              <p className="text-xs text-profit-600">
                Dividends growing {dividends.dividendGrowthCAGR >= 0 ? 'faster' : 'slower'} than inflation
              </p>
            </div>
            <div className="text-3xl font-mono font-bold text-profit font-numeric letter-tight">
              {dividends.dividendGrowthCAGR > 0 ? '+' : ''}{dividends.dividendGrowthCAGR.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
