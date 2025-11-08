import { motion } from 'framer-motion'

interface TutorialTooltipProps {
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  step: number
  totalSteps: number
  onNext: () => void
  onSkip: () => void
  targetRef?: React.RefObject<HTMLElement>
}

export default function TutorialTooltip({
  title,
  content,
  position,
  step,
  totalSteps,
  onNext,
  onSkip,
  targetRef
}: TutorialTooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-4',
    bottom: 'top-full mt-4',
    left: 'right-full mr-4',
    right: 'left-full ml-4'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-t-white border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-l-white border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-r-white border-t-transparent border-b-transparent border-l-transparent'
  }

  // Calculate absolute position based on target element
  const getTooltipStyle = () => {
    if (!targetRef?.current) return {}

    const rect = targetRef.current.getBoundingClientRect()
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft
    const scrollY = window.pageYOffset || document.documentElement.scrollTop

    const base = {
      position: 'fixed' as const,
      zIndex: 80
    }

    switch (position) {
      case 'bottom':
        return {
          ...base,
          top: rect.bottom + 20,
          left: rect.left + (rect.width / 2),
          transform: 'translateX(-50%)'
        }
      case 'top':
        return {
          ...base,
          bottom: window.innerHeight - rect.top + 20,
          left: rect.left + (rect.width / 2),
          transform: 'translateX(-50%)'
        }
      case 'right':
        return {
          ...base,
          top: rect.top + (rect.height / 2),
          left: rect.right + 20,
          transform: 'translateY(-50%)'
        }
      case 'left':
        return {
          ...base,
          top: rect.top + (rect.height / 2),
          right: window.innerWidth - rect.left + 20,
          transform: 'translateY(-50%)'
        }
    }
  }

  return (
    <>
      {/* Spotlight overlay */}
      <div className="fixed inset-0 bg-black/50 z-[75]" onClick={onSkip} />

      {/* Spotlight highlight for target */}
      {targetRef?.current && (
        <div
          className="fixed z-[76] rounded-lg ring-4 ring-primary-400/50 pointer-events-none"
          style={{
            top: targetRef.current.getBoundingClientRect().top - 8,
            left: targetRef.current.getBoundingClientRect().left - 8,
            width: targetRef.current.getBoundingClientRect().width + 16,
            height: targetRef.current.getBoundingClientRect().height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        style={getTooltipStyle()}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm z-[80]"
      >
        {/* Arrow */}
        <div className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`} />

        {/* Content */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <span className="text-xs text-gray-500 font-medium">
              {step} / {totalSteps}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === step
                  ? 'w-6 bg-primary-500'
                  : i + 1 < step
                    ? 'w-1.5 bg-primary-300'
                    : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip Tour
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium shadow-md"
          >
            {step === totalSteps ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
