import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsMounted(true)
    // Small delay for animation
    setTimeout(() => setIsVisible(true), 10)
  }

  const hideTooltip = () => {
    setIsVisible(false)
    timeoutRef.current = setTimeout(() => {
      setIsMounted(false)
    }, 200) // Match transition duration
  }

  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip()
    } else {
      showTooltip()
    }
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Trigger */}
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={toggleTooltip}
        className="cursor-help"
      >
        {children}
      </div>

      {/* Tooltip */}
      {isMounted && (
        <div
          className={`absolute z-50 ${positionClasses[position]} transition-opacity duration-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          role="tooltip"
        >
          {/* Tooltip Content */}
          <div className="bg-slate-800 text-white text-sm rounded-lg py-2 px-3 shadow-lg max-w-xs">
            {content}
          </div>

          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  )
}

interface InfoIconProps {
  className?: string
}

export const InfoIcon: React.FC<InfoIconProps> = ({ className = '' }) => {
  return (
    <svg
      className={`w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

interface TooltipLabelProps {
  label: string
  tooltip: string | React.ReactNode
  className?: string
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  label,
  tooltip,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span>{label}</span>
      <Tooltip content={tooltip}>
        <InfoIcon />
      </Tooltip>
    </div>
  )
}
