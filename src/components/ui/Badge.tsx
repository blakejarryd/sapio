import React from 'react'

type BadgeVariant = 'profitable' | 'warning' | 'caution' | 'neutral'
type BadgeSize = 'small' | 'medium' | 'large'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium',
  className = ''
}) => {
  const variantClasses = {
    profitable: 'bg-profit text-white shadow-xs ring-1 ring-profit/20',
    warning: 'bg-amber-500 text-white shadow-xs ring-1 ring-amber-500/20',
    caution: 'bg-loss text-white shadow-xs ring-1 ring-loss/20',
    neutral: 'bg-slate-100 text-slate-700 shadow-xs ring-1 ring-slate-900/5'
  }

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs font-semibold',
    medium: 'px-3 py-1 text-sm font-semibold',
    large: 'px-4 py-1.5 text-base font-semibold'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-md
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        transition-smooth
        ${className}
      `}
    >
      {children}
    </span>
  )
}
