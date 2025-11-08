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
    profitable: 'bg-status-profitable text-white',
    warning: 'bg-status-warning text-white',
    caution: 'bg-status-caution text-white',
    neutral: 'bg-slate-100 text-slate-700'
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={`
        inline-flex items-center
        rounded-md
        font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
