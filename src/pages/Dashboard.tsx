import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import MetricGrid from '../components/MetricGrid'
import CompanySelector from '../components/CompanySelector'
import TutorialTooltip from '../components/TutorialTooltip'
import { fetchCompanyData } from '../services/api'
import { CompanyData } from '../types/company'

export default function Dashboard() {
  // Tutorial-enabled dashboard for company metrics
  const { ticker } = useParams<{ ticker: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCompanySelector, setShowCompanySelector] = useState(false)

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(1)
  const companyInfoRef = useRef<HTMLDivElement>(null)
  const compareButtonRef = useRef<HTMLButtonElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if tour should start
    if (searchParams.get('tour') === 'true') {
      setTimeout(() => setShowTutorial(true), 1000)
    }
  }, [searchParams])

  useEffect(() => {
    async function loadCompanyData() {
      if (!ticker) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchCompanyData(ticker)
        setCompanyData(data)
      } catch (err) {
        setError('Failed to load company data. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyData()
  }, [ticker])

  const tutorialSteps = [
    {
      title: 'Company Overview',
      content: "This is where you'll see key information about the company, including its sector and industry.",
      targetRef: companyInfoRef,
      position: 'bottom' as const
    },
    {
      title: 'Compare Companies',
      content: 'Click here to compare this company with others in the market. See side-by-side metrics and charts.',
      targetRef: compareButtonRef,
      position: 'bottom' as const
    },
    {
      title: 'Key Metrics',
      content: "These 7 metrics give you a complete picture of the company's financial health. Click any metric to learn more and see 5-year trends.",
      targetRef: metricsRef,
      position: 'top' as const
    }
  ]

  const handleNextStep = () => {
    if (tutorialStep < tutorialSteps.length) {
      setTutorialStep(tutorialStep + 1)
    } else {
      // Tour complete
      localStorage.setItem('sapio_onboarding_completed', 'completed')
      setShowTutorial(false)
      // Remove tour param from URL
      navigate(`/company/${ticker}`, { replace: true })
    }
  }

  const handleSkipTour = () => {
    localStorage.setItem('sapio_onboarding_completed', 'skipped')
    setShowTutorial(false)
    navigate(`/company/${ticker}`, { replace: true })
  }

  return (
    <div className="relative min-h-screen bg-premium-gradient noise-texture">
      {/* Home button - positioned over the header */}
      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/30 transition-colors group shadow-lg border border-white/20"
      >
        <svg
          className="w-5 h-5 text-primary-600 group-hover:text-primary-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-sm font-semibold text-gradient hidden sm:inline">SAPIO</span>
      </button>

      {/* Header with animated search bar */}
      <SearchBar isHeader initialValue="" />

      {/* Main content - positioned below header */}
      <div className="pt-24 pb-12">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading company data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 font-semibold mb-2">Error</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {companyData && !isLoading && !error && (
          <>
            {/* Company info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto px-4 mb-8"
            >
              <div ref={companyInfoRef} className="glass rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
                  {companyData.companyName}
                </h1>
                <div className="flex items-center justify-center gap-3 text-gray-700 font-medium mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold tracking-wide">
                    {companyData.ticker}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm">{companyData.exchange}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-3">
                  <span className="font-medium">{companyData.sector}</span>
                  <span className="text-gray-400">›</span>
                  <span>{companyData.industry}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Last updated: {new Date(companyData.lastUpdated).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>

                {/* Compare button */}
                <button
                  ref={compareButtonRef}
                  onClick={() => setShowCompanySelector(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Compare with Another Company
                </button>
              </div>
            </motion.div>

            {/* 7 Metric Tiles */}
            <div ref={metricsRef}>
              <MetricGrid metrics={companyData.metrics} ticker={ticker!} />
            </div>
          </>
        )}
      </div>

      {/* Company Selector Modal */}
      <AnimatePresence>
        {showCompanySelector && ticker && (
          <CompanySelector
            currentTicker={ticker}
            onClose={() => setShowCompanySelector(false)}
          />
        )}
      </AnimatePresence>

      {/* Tutorial Tooltip */}
      <AnimatePresence>
        {showTutorial && tutorialSteps[tutorialStep - 1] && (
          <TutorialTooltip
            title={tutorialSteps[tutorialStep - 1].title}
            content={tutorialSteps[tutorialStep - 1].content}
            position={tutorialSteps[tutorialStep - 1].position}
            step={tutorialStep}
            totalSteps={tutorialSteps.length}
            onNext={handleNextStep}
            onSkip={handleSkipTour}
            targetRef={tutorialSteps[tutorialStep - 1].targetRef}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
