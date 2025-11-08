import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import WelcomeModal from '../components/WelcomeModal'

export default function Home() {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('sapio_onboarding_completed')
    if (!hasSeenOnboarding) {
      // Show welcome modal after a brief delay
      setTimeout(() => setShowWelcome(true), 800)
    }
  }, [])

  const handleStartTour = () => {
    localStorage.setItem('sapio_onboarding_completed', 'tour_started')
    setShowWelcome(false)
    // Navigate to a demo company to start tour
    navigate('/company/AAPL?tour=true')
  }

  const handleCloseWelcome = () => {
    setShowWelcome(false)
  }

  return (
    <div className="relative min-h-screen bg-premium-gradient noise-texture flex items-center justify-center overflow-hidden">
      {/* Logo/Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-8 left-0 right-0 mx-auto max-w-2xl px-8 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-2 tracking-wide">
          SAPIO
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-700 font-medium tracking-wide"
        >
          Company research simplified
        </motion.p>
      </motion.div>

      {/* Centered Search Bar with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        className="w-full"
      >
        <SearchBar />

        {/* Browse Industries Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={() => navigate('/industries')}
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/30 rounded-lg hover:bg-white/40 transition-all group shadow-lg"
          >
            <svg className="w-5 h-5 text-primary-600 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-gray-900">Browse by Industry</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-0 right-0 mx-auto max-w-2xl px-8 text-center text-sm text-gray-600 font-medium"
      >
        <p className="tracking-wide">
          Search for companies like{' '}
          <span className="text-primary-600 font-semibold">Tesla</span>,{' '}
          <span className="text-primary-600 font-semibold">Apple</span>,{' '}
          <span className="text-primary-600 font-semibold">Microsoft</span>,{' '}
          <span className="text-primary-600 font-semibold">Google</span>, or{' '}
          <span className="text-primary-600 font-semibold">Amazon</span>
        </p>
      </motion.div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal
            onClose={handleCloseWelcome}
            onStartTour={handleStartTour}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
