import React from 'react'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      style={style}
      aria-label="Loading..."
    />
  )
}

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export const SkeletonChart: React.FC<{ className?: string }> = ({
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex items-end justify-between h-full gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={4} />
    </div>
  )
}
