import { motion } from 'framer-motion'

interface WelcomeModalProps {
  onClose: () => void
  onStartTour: () => void
}

export default function WelcomeModal({ onClose, onStartTour }: WelcomeModalProps) {
  const handleSkip = () => {
    localStorage.setItem('sapio_onboarding_completed', 'skipped')
    onClose()
  }

  const handleStart = () => {
    onStartTour()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold"
          >
            S
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to SAPIO!
          </h1>
          <p className="text-gray-600 text-lg">
            Your guide to smarter investing
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-white/50"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">7 Key Metrics</h3>
              <p className="text-sm text-gray-600">
                Track market cap, revenue, profitability, debt, and valuation ratios
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-white/50"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Industry Context</h3>
              <p className="text-sm text-gray-600">
                Compare companies to their industry averages and peers
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-white/50"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Learn as You Explore</h3>
              <p className="text-sm text-gray-600">
                Each metric includes beginner-friendly explanations and red flags
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Skip Tour
          </button>
          <button
            onClick={handleStart}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:from-primary-600 hover:to-purple-600 transition-all font-medium shadow-lg"
          >
            Start Tour
          </button>
        </div>
      </motion.div>
    </div>
  )
}
