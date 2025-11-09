import React from 'react'
import { ProfitabilityInfo } from '../../types/company'
import { Badge } from '../ui'

interface ProfitabilityBadgeProps {
  profitability: ProfitabilityInfo
  size?: 'small' | 'medium' | 'large'
}

export const ProfitabilityBadge: React.FC<ProfitabilityBadgeProps> = ({
  profitability,
  size = 'large'
}) => {
  const getBadgeText = (): string => {
    switch (profitability.status) {
      case 'profitable':
        return `Profitable for ${profitability.consecutiveYears} consecutive years`
      case 'recently-profitable':
        return `Turned profitable in ${profitability.profitableSince}`
      case 'pre-profit':
        return 'Has revenue, not yet profitable'
      case 'pre-revenue':
        return 'Pre-revenue stage'
      case 'intermittent':
        return `Profitable in ${profitability.profitableYearsCount} of last ${profitability.totalYears} years`
      default:
        return 'Unknown status'
    }
  }

  const getBadgeVariant = (): 'profitable' | 'warning' | 'caution' => {
    switch (profitability.status) {
      case 'profitable':
        return 'profitable'
      case 'recently-profitable':
        return 'profitable'
      case 'pre-profit':
        return 'warning'
      case 'pre-revenue':
        return 'caution'
      case 'intermittent':
        return 'warning'
      default:
        return 'caution'
    }
  }

  return (
    <Badge variant={getBadgeVariant()} size={size}>
      {getBadgeText()}
    </Badge>
  )
}
