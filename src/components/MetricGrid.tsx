import { motion } from 'framer-motion'
import { CompanyMetrics, MetricKey } from '../types/company'
import MetricTile from './MetricTile'

interface MetricGridProps {
  metrics: CompanyMetrics
  ticker: string
}

const metricKeys: MetricKey[] = [
  'marketCap',
  'revenue',
  'salesGrowth',
  'netIncome',
  'profitMargin',
  'totalDebt',
  'peRatio',
]

export default function MetricGrid({ metrics, ticker }: MetricGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-4 max-w-6xl mx-auto"
    >
      {metricKeys.map((key, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth entrance
          }}
          className="h-full w-full"
        >
          <MetricTile metricKey={key} metric={metrics[key]} ticker={ticker} />
        </motion.div>
      ))}
    </motion.div>
  )
}
