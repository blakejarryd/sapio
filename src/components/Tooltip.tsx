import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children?: React.ReactNode
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom

      // Position tooltip where there's more space
      setPosition(spaceBelow > spaceAbove ? 'bottom' : 'top')
    }
  }, [isVisible])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  return (
    <div className="relative inline-block">
      {children ? (
        <button
          ref={triggerRef}
          onClick={handleToggle}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 rounded-full"
          aria-label="More information"
          type="button"
        >
          {children}
        </button>
      ) : (
        <button
          ref={triggerRef}
          onClick={handleToggle}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1"
          aria-label="More information"
          type="button"
        >
          ?
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            } left-1/2 transform -translate-x-1/2 w-64 px-3 py-2 text-xs text-gray-700 bg-white rounded-lg shadow-xl border border-gray-200`}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Arrow */}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-gray-200 ${
                position === 'top'
                  ? 'bottom-[-4px] border-b border-r rotate-45'
                  : 'top-[-4px] border-t border-l rotate-45'
              }`}
            />

            <p className="relative z-10 leading-relaxed">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
