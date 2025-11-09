import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts'
import { AnnualFinancials } from '../../types/company'
import { Card, TooltipLabel } from '../ui'
import { formatCurrency } from '../../utils/formatters'
import { tooltipContent } from '../../utils/tooltipContent'

interface EarningsRevenueChartProps {
  financials: AnnualFinancials[]
  currency: string
  revenueCAGR: number
  earningsCAGR: number
}

export const EarningsRevenueChart: React.FC<EarningsRevenueChartProps> = ({
  financials,
  currency,
  revenueCAGR,
  earningsCAGR
}) => {
  // Sort by year
  const sortedData = [...financials].sort((a, b) => a.year - b.year)

  // Transform data for chart
  const chartData = sortedData.map(f => ({
    year: f.year.toString(),
    revenue: f.revenue,
    earnings: f.earnings,
    profitMargin: f.revenue > 0 ? (f.earnings / f.revenue) * 100 : 0
  }))

  const formatYAxis = (value: number) => {
    return formatCurrency(value, currency)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-slate-200/60 rounded-lg shadow-elevated p-4">
          <div className="font-bold text-slate-900 mb-3 text-base">{data.year}</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-600 font-medium">Revenue:</span>
              <span className="font-mono font-semibold text-slate-900 font-numeric">
                {formatCurrency(data.revenue, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-600 font-medium">Earnings:</span>
              <span className={`font-mono font-semibold font-numeric ${data.earnings >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(data.earnings, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-100">
              <span className="text-slate-600 font-medium">Margin:</span>
              <span className={`font-mono font-semibold font-numeric ${data.profitMargin >= 0 ? 'text-profit' : 'text-loss'}`}>
                {data.profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
            Revenue & Earnings History
          </h2>
          <p className="text-sm text-slate-600">
            10-year financial performance showing actual business results
          </p>
        </div>
        <div className="text-left sm:text-right">
          <TooltipLabel
            label="Growth Rates"
            tooltip={tooltipContent.cagr}
            className="text-sm text-slate-600 mb-1"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
            <div>
              <span className="text-slate-500">Revenue CAGR: </span>
              <span className="font-mono font-semibold text-slate-900">
                {revenueCAGR > 0 ? '+' : ''}{revenueCAGR.toFixed(1)}%
              </span>
            </div>
            {earningsCAGR > 0 && (
              <div>
                <span className="text-slate-500">Earnings CAGR: </span>
                <span className="font-mono font-semibold text-profit">
                  +{earningsCAGR.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
            <Legend
              wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: 600 }}
              iconType="rect"
              iconSize={12}
            />
            <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} strokeDasharray="none" />
            <Bar
              dataKey="revenue"
              fill="#71717a"
              name="Revenue"
              radius={[6, 6, 0, 0]}
              opacity={0.9}
            />
            <Bar
              dataKey="earnings"
              fill="#10b981"
              name="Earnings (Profit)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200/60">
        <span className="font-medium">How to read:</span> Green bars show profit (earnings). Bars below zero indicate losses. Revenue (gray) provides context for total income before expenses.
      </div>
    </Card>
  )
}
