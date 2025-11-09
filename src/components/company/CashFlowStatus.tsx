import React from 'react'
import { AnnualFinancials, CashFlowInfo } from '../../types/company'
import { Card, StatusIndicator, TooltipLabel } from '../ui'
import { formatCurrency } from '../../utils/formatters'
import { tooltipContent } from '../../utils/tooltipContent'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip
} from 'recharts'

interface CashFlowStatusProps {
  cashFlow: CashFlowInfo
  financials: AnnualFinancials[]
}

export const CashFlowStatus: React.FC<CashFlowStatusProps> = ({
  cashFlow,
  financials
}) => {
  // Get last 5 years
  const lastFiveYears = [...financials]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5)
    .reverse()

  const chartData = lastFiveYears.map(f => ({
    year: f.year.toString().slice(-2), // Show last 2 digits
    cashFlow: f.operatingCashFlow
  }))

  const getStatusText = () => {
    const amount = formatCurrency(Math.abs(cashFlow.fiveYearTotal), cashFlow.currency)
    switch (cashFlow.status) {
      case 'generative':
        return `Generated ${amount} in operating cash over 5 years`
      case 'neutral':
        return 'Roughly cash neutral over 5 years'
      case 'burning':
        return `Burned ${amount} in operating cash over 5 years`
    }
  }

  const getStatusType = (): 'profitable' | 'warning' | 'caution' => {
    switch (cashFlow.status) {
      case 'generative':
        return 'profitable'
      case 'neutral':
        return 'warning'
      case 'burning':
        return 'caution'
    }
  }

  return (
    <Card>
      <div className="flex items-start gap-3 mb-4">
        <StatusIndicator type={getStatusType()} size={12} className="mt-1" />
        <div>
          <TooltipLabel
            label="Cash Flow Status"
            tooltip={tooltipContent.cashFlow}
            className="text-h3 text-slate-900 mb-1"
          />
          <p className="text-sm text-slate-700">{getStatusText()}</p>
        </div>
      </div>

      <div className="h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  return (
                    <div className="bg-white border border-slate-200/60 rounded-lg px-3 py-2 shadow-elevated">
                      <div className="text-sm font-bold font-mono font-numeric">
                        {formatCurrency(value, cashFlow.currency)}
                      </div>
                    </div>
                  )
                }
                return null
              }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
            <Bar
              dataKey="cashFlow"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Operating cash flow measures actual cash the business generates from operations.
        Positive is good, negative means capital is required to sustain operations.
      </p>
    </Card>
  )
}
