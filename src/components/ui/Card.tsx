import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  hover?: boolean
  elevated?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  hover = false,
  elevated = false
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const shadowClass = elevated ? 'shadow-elevated' : 'shadow-card'
  const hoverClass = hover ? 'hover-lift shadow-card hover:shadow-card-hover' : ''

  return (
    <div
      className={`
        bg-white
        border border-slate-200/60
        rounded-lg
        ${shadowClass}
        ${paddingClasses[padding]}
        ${hoverClass}
        transition-smooth
        ${className}
      `}
    >
      {children}
    </div>
  )
}
