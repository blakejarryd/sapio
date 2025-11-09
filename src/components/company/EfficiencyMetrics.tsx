import React from 'react'
import { AnnualFinancials } from '../../types/company'
import { Card, TooltipLabel } from '../ui'
import { calculateROE, calculateAverageROE } from '../../utils/calculations'
import { calculateProfitMargin } from '../../utils/calculations'
import { tooltipContent } from '../../utils/tooltipContent'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts'

interface EfficiencyMetricsProps {
  financials: AnnualFinancials[]
}

export const EfficiencyMetrics: React.FC<EfficiencyMetricsProps> = ({
  financials
}) => {
  const sorted = [...financials].sort((a, b) => a.year - b.year)
  const latest = sorted[sorted.length - 1]

  const currentROE = calculateROE(latest.earnings, latest.shareholderEquity)
  const averageROE = calculateAverageROE(financials)
  const currentMargin = calculateProfitMargin(latest.revenue, latest.earnings)

  // Prepare trend data
  const roeData = sorted.map(f => ({
    year: f.year.toString().slice(-2),
    roe: calculateROE(f.earnings, f.shareholderEquity)
  }))

  const marginData = sorted.map(f => ({
    year: f.year.toString().slice(-2),
    margin: calculateProfitMargin(f.revenue, f.earnings)
  }))

  const getROEAssessment = (roe: number) => {
    if (roe >= 15) return { label: 'Excellent', color: 'text-profit' }
    if (roe >= 10) return { label: 'Good', color: 'text-profit' }
    if (roe >= 5) return { label: 'Moderate', color: 'text-status-warning' }
    if (roe > 0) return { label: 'Poor', color: 'text-status-warning' }
    return { label: 'Negative', color: 'text-loss' }
  }

  const roeAssessment = getROEAssessment(currentROE)

  return (
    <Card className="col-span-full">
      <h3 className="text-h2 text-slate-900 mb-6">Efficiency Metrics</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Return on Equity */}
        <div>
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-3">
              <TooltipLabel
                label="Return on Equity (ROE)"
                tooltip={tooltipContent.roe}
                className="text-base font-semibold text-slate-900"
              />
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${roeAssessment.color}`}>
                {roeAssessment.label}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-mono font-bold text-slate-900 font-numeric letter-tight">
                {currentROE.toFixed(1)}%
              </span>
              <span className="text-sm text-slate-500 font-medium">
                5yr avg: <span className="font-mono font-numeric">{averageROE.toFixed(1)}%</span>
              </span>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-200/60 rounded-lg px-3 py-2 shadow-elevated">
                          <div className="text-sm font-bold font-mono font-numeric">
                            {payload[0].value}% ROE
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="roe"
                  stroke="#0369a1"
                  strokeWidth={3}
                  dot={{ fill: '#0369a1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            ROE measures how efficiently the company converts shareholder equity into profit.
            Like rental yield on your property equity.
          </p>
        </div>

        {/* Profit Margin */}
        <div>
          <div className="mb-4">
            <TooltipLabel
              label="Net Profit Margin"
              tooltip={tooltipContent.profitMargin}
              className="text-base font-semibold text-slate-900 mb-3"
            />
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-mono font-bold text-slate-900 font-numeric letter-tight">
                {currentMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-200/60 rounded-lg px-3 py-2 shadow-elevated">
                          <div className="text-sm font-bold font-mono font-numeric">
                            {payload[0].value}% margin
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            For every $100 in sales, the company keeps ${currentMargin.toFixed(2)} as profit.
            Higher margins indicate pricing power and efficiency.
          </p>
        </div>
      </div>
    </Card>
  )
}
