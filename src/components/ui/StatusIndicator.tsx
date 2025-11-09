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
    profitable: 'bg-status-profitable',
    warning: 'bg-status-warning',
    caution: 'bg-status-caution'
  }

  return (
    <span
      className={`
        inline-block
        rounded-full
        ${colorClasses[type]}
        ${className}
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label={`Status: ${type}`}
    />
  )
}
