import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  hover = false
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  return (
    <div
      className={`
        bg-white
        border border-slate-200
        rounded-lg
        ${paddingClasses[padding]}
        ${hover ? 'hover-lift' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
