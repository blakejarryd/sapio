import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { HistoricalDataPoint } from '../types/company'
import { formatNumber, formatCurrency, formatPercentage } from '../utils/formatters'

interface MetricChartProps {
  data: HistoricalDataPoint[]
  metricKey: string
  isCurrency?: boolean
  isPercentage?: boolean
  industryAverage?: number
  metricLabel?: string
}

export default function MetricChart({
  data,
  metricKey,
  isCurrency = false,
  isPercentage = false,
  industryAverage,
  metricLabel
}: MetricChartProps) {
  const formatValue = (value: number) => {
    if (isPercentage) return formatPercentage(value)
    if (isCurrency) return formatCurrency(value)
    return formatNumber(value)
  }

  // Transform data to include industry average if provided
  const chartData = industryAverage
    ? data.map(point => ({
        ...point,
        industryAverage: industryAverage
      }))
    : data

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={formatValue}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatValue(value),
              name === 'value' ? metricLabel || metricKey : 'Industry Average'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          {industryAverage && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            name={metricLabel || metricKey}
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
          {industryAverage && (
            <Line
              type="monotone"
              dataKey="industryAverage"
              name="Industry Average"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#9ca3af', r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
