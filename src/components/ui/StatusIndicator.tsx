import React from 'react'

type StatusType = 'profitable' | 'warning' | 'caution'

interface StatusIndicatorProps {
  type: StatusType
  size?: number
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  size = 8,
  className = ''
}) => {
  const colorClasses = {
    profitable: 'bg-profit ring-2 ring-profit/20',
    warning: 'bg-amber-500 ring-2 ring-amber-500/20',
    caution: 'bg-loss ring-2 ring-loss/20'
  }

  return (
    <span
      className={`
        inline-block
        rounded-full
        ${colorClasses[type]}
        shadow-xs
        ${className}
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label={`Status: ${type}`}
    />
  )
}
