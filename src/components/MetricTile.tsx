import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Metric, MetricKey, METRIC_INFO } from '../types/company'
import { getGrowthColor } from '../utils/formatters'
import { metricColorPalettes, shadows, borders, spacing, transitions } from '../utils/theme'
import MarketCapIcon from './icons/MarketCapIcon'
import RevenueIcon from './icons/RevenueIcon'
import SalesGrowthIcon from './icons/SalesGrowthIcon'
import NetIncomeIcon from './icons/NetIncomeIcon'
import ProfitMarginIcon from './icons/ProfitMarginIcon'
import TotalDebtIcon from './icons/TotalDebtIcon'
import PERatioIcon from './icons/PERatioIcon'
import Tooltip from './Tooltip'
import Sparkline from './Sparkline'

interface MetricTileProps {
  metricKey: MetricKey
  metric: Metric
  ticker: string
}

// Icon component mapping
const metricIcons: Record<MetricKey, React.ComponentType<{ className?: string }>> = {
  marketCap: MarketCapIcon,
  revenue: RevenueIcon,
  salesGrowth: SalesGrowthIcon,
  netIncome: NetIncomeIcon,
  profitMargin: ProfitMarginIcon,
  totalDebt: TotalDebtIcon,
  peRatio: PERatioIcon,
}

export default function MetricTile({ metricKey, metric, ticker }: MetricTileProps) {
  const navigate = useNavigate()
  const info = METRIC_INFO[metricKey]
  const colors = metricColorPalettes[metricKey]
  const IconComponent = metricIcons[metricKey]

  const handleClick = () => {
    navigate(`/company/${ticker}/metric/${metricKey}`)
  }

  // Determine if metric shows growth (for color coding)
  const isGrowthMetric = metricKey === 'salesGrowth'
  const valueColor = isGrowthMetric ? getGrowthColor(metric.value) : colors.accent

  // Calculate year-over-year change
  const getYoYChange = () => {
    if (!metric.historical || metric.historical.length < 2) return null

    const sortedHistory = [...metric.historical].sort((a, b) => b.year - a.year)
    const currentYear = sortedHistory[0]
    const previousYear = sortedHistory[1]

    if (!currentYear || !previousYear || previousYear.value === 0) return null

    const change = ((currentYear.value - previousYear.value) / Math.abs(previousYear.value)) * 100

    // For totalDebt, negative change is good (less debt)
    const isPositiveGood = metricKey !== 'totalDebt'
    const isGoodChange = isPositiveGood ? change > 0 : change < 0

    return {
      value: change,
      label: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
      color: Math.abs(change) < 0.1
        ? 'text-gray-500'
        : isGoodChange
          ? 'text-emerald-600'
          : 'text-red-600',
      bgColor: Math.abs(change) < 0.1
        ? 'bg-gray-50'
        : isGoodChange
          ? 'bg-emerald-50'
          : 'bg-red-50',
      icon: change > 0 ? '↑' : change < 0 ? '↓' : '→'
    }
  }

  const yoyChange = getYoYChange()

  // Calculate industry comparison
  const getIndustryComparison = () => {
    if (!metric.industryAverage) return null

    const difference = metric.value - metric.industryAverage
    const percentDiff = Math.abs(difference / metric.industryAverage * 100)

    // Within 5% is considered "average"
    if (percentDiff < 5) {
      return { label: '≈ Industry Avg', color: 'bg-gray-100 text-gray-600' }
    }

    if (difference > 0) {
      return { label: '↑ Above Avg', color: 'bg-emerald-100 text-emerald-700' }
    }

    return { label: '↓ Below Avg', color: 'bg-orange-100 text-orange-700' }
  }

  const industryComp = getIndustryComparison()

  // Sparkline colors matching metric color palette
  const sparklineColors: Record<MetricKey, string> = {
    marketCap: '#64748b',
    revenue: '#10b981',
    salesGrowth: '#3b82f6',
    netIncome: '#8b5cf6',
    profitMargin: '#f59e0b',
    totalDebt: '#ef4444',
    peRatio: '#6366f1',
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`${colors.bg} rounded-2xl ${shadows.sm} ${spacing.cardPadding} text-left ${shadows.hoverLg} ${transitions.default} ${borders.subtle} relative overflow-hidden group h-full w-full flex flex-col`}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex-1 flex flex-col">
        {/* Icon + Label on same line */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`inline-flex items-center justify-center ${spacing.iconSize.lg} ${colors.iconBg} rounded-xl ${shadows.sm}`}>
            <IconComponent className={`${spacing.iconSize.sm} ${colors.iconText}`} />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
              {info.label}
            </h3>
            <Tooltip content={metric.description} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <div className={`text-3xl font-semibold tracking-tight ${valueColor}`}>
            {metric.displayValue}
          </div>

          {/* YoY change indicator */}
          {yoyChange && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${yoyChange.bgColor} ${yoyChange.color}`}>
              <span>{yoyChange.icon}</span>
              <span>{yoyChange.label}</span>
            </span>
          )}
        </div>

        {/* Industry comparison indicator */}
        {industryComp && (
          <div className="mb-3">
            <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide ${industryComp.color}`}>
              {industryComp.label}
            </span>
          </div>
        )}

        {/* Historical trend sparkline */}
        {metric.historical && metric.historical.length >= 2 && (
          <div className="mb-3 flex items-center gap-2">
            <Sparkline
              data={metric.historical}
              color={sparklineColors[metricKey]}
              width={100}
              height={28}
            />
            <span className="text-[9px] text-gray-400 uppercase tracking-wider">
              {metric.historical[0]?.year}–{metric.historical[metric.historical.length - 1]?.year}
            </span>
          </div>
        )}

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {metric.description}
        </p>
      </div>
    </motion.button>
  )
}
