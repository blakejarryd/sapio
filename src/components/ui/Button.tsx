import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed focus-ring'

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-xs hover:shadow-card active:shadow-xs',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs hover:shadow-card active:shadow-xs',
    ghost: 'text-accent hover:bg-accent-50 active:bg-accent-100'
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm h-8',
    medium: 'px-4 py-2 text-base h-10',
    large: 'px-6 py-3 text-lg h-12'
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
