import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { CompanyData, MetricKey, METRIC_INFO } from '../types/company'

interface ComparisonChartProps {
  company1: CompanyData
  company2: CompanyData
  metricKeys: MetricKey[]
}

export default function ComparisonChart({ company1, company2, metricKeys }: ComparisonChartProps) {
  // Transform data for chart
  const chartData = metricKeys.map(key => {
    const metric1 = company1.metrics[key]
    const metric2 = company2.metrics[key]
    const info = METRIC_INFO[key]

    return {
      name: info.label,
      [company1.ticker]: metric1.value,
      [company2.ticker]: metric2.value,
    }
  })

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">
                {entry.name}: {entry.payload[`${entry.name}_display`] || entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <YAxis
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar
            dataKey={company1.ticker}
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={company2.ticker}
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
