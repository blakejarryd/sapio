import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCompanyData } from '../services/api'
import { CompanyData, MetricKey, METRIC_INFO } from '../types/company'
import MetricChart from '../components/MetricChart'
import { getGrowthColor } from '../utils/formatters'

export default function MetricDetail() {
  const { ticker, metricKey } = useParams<{ ticker: string; metricKey: string }>()
  const navigate = useNavigate()
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient noise-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading metric data...</p>
        </div>
      </div>
    )
  }

  if (error || !companyData || !metricKey) {
    return (
      <div className="min-h-screen bg-premium-gradient noise-texture flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="glass rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-2">Error</p>
            <p className="text-gray-700 mb-4">{error || 'Invalid metric'}</p>
            <button
              onClick={() => navigate(`/company/${ticker}`)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const metric = companyData.metrics[metricKey as MetricKey]
  const info = METRIC_INFO[metricKey as MetricKey]

  const isGrowthMetric = metricKey === 'salesGrowth'
  const isCurrencyMetric = ['marketCap', 'revenue', 'netIncome', 'totalDebt'].includes(metricKey)
  const isPercentageMetric = ['salesGrowth', 'profitMargin'].includes(metricKey)
  const valueColor = isGrowthMetric ? getGrowthColor(metric.value) : 'text-gray-900'

  return (
    <div className="min-h-screen bg-premium-gradient noise-texture">
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

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 glass border-b border-white/20 shadow-lg px-4 py-4 z-50">
        {/* Back to Dashboard button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/company/${ticker}`)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            <span className="mr-2">←</span> Back to {companyData.companyName}
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 pt-24 pb-8"
      >
        {/* Metric Header */}
        <div className="glass rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{info.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{info.label}</h1>
              <p className="text-gray-600 text-lg">{metric.description}</p>
            </div>
          </div>

          <div className={`text-5xl font-bold ${valueColor} mt-4`}>
            {metric.displayValue}
          </div>

          <div className="text-sm text-gray-500 mt-2">
            {companyData.companyName} ({ticker})
          </div>
        </div>

        {/* Historical Chart */}
        <div className="glass rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5-Year History</h2>
          <MetricChart
            data={metric.historical}
            metricKey={info.label}
            isCurrency={isCurrencyMetric}
            isPercentage={isPercentageMetric}
            industryAverage={metric.industryAverage}
            metricLabel={companyData.companyName}
          />
        </div>

        {/* Educational Content */}
        <div className="glass rounded-2xl shadow-xl border border-white/20 p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Understanding This Metric</h2>
          <div className="text-gray-700 space-y-6">
            {metricKey === 'marketCap' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Market capitalization</strong> (market cap) is the total value of a
                    company's outstanding shares of stock. It's calculated by multiplying the current
                    stock price by the total number of shares.
                  </p>
                  <p>
                    Think of it as the price tag for buying the entire company. If you wanted to purchase
                    every single share, this is how much you'd need to pay.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Market cap tells you the company's size and often indicates its stability and risk level.
                    Larger companies tend to be more stable but grow more slowly. Smaller companies can grow
                    faster but are riskier.
                  </p>
                  <p>
                    It also affects which investors can buy the stock—some mutual funds and pension funds can
                    only invest in large-cap stocks for safety reasons.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Large-cap (over $10B):</strong> Established companies like Apple, Microsoft. More stable, steady growth.</li>
                    <li><strong>Mid-cap ($2B-$10B):</strong> Growing companies. Balance of growth potential and stability.</li>
                    <li><strong>Small-cap (under $2B):</strong> Younger companies. Higher growth potential but more volatile.</li>
                  </ul>
                  <p className="mt-2">
                    There's no "good" or "bad" market cap—it depends on your investment goals and risk tolerance.
                    Beginners often start with large-caps for stability.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Market cap shrinking rapidly:</strong> Could signal fundamental problems with the business</li>
                    <li><strong>Market cap seems too high for revenue:</strong> Company might be overvalued compared to actual sales</li>
                    <li><strong>Very small market cap (under $300M):</strong> "Micro-cap" stocks are extremely risky and volatile</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p>
                    Market cap alone doesn't tell the full story. Compare it to <strong>revenue</strong> (are they
                    actually selling a lot?) and <strong>net income</strong> (are they profitable?). A company with
                    high market cap but low/negative profit might be overvalued.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'revenue' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Revenue</strong> (also called "sales" or "top line") is the total amount
                    of money a company brings in from its business activities before any expenses
                    are deducted.
                  </p>
                  <p>
                    It's the first line on an income statement. Revenue shows raw demand for the company's
                    products or services, but doesn't account for costs or profitability yet.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Revenue growth indicates whether more customers are buying from the company. It's a measure
                    of market demand and competitive position. Companies need revenue to eventually become
                    profitable.
                  </p>
                  <p>
                    However, high revenue doesn't automatically mean a good investment—many companies have massive
                    sales but lose money because their costs are too high.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">
                    There's no universal "good" revenue number—it depends on the company's industry and size.
                    Instead, look for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Consistent growth:</strong> Revenue increasing year-over-year shows healthy demand</li>
                    <li><strong>Industry comparison:</strong> Compare to competitors in the same sector</li>
                    <li><strong>Profit conversion:</strong> Revenue should eventually turn into profit (check profit margin)</li>
                  </ul>
                  <p className="mt-2">
                    A tech startup with $1B revenue growing 50% yearly is different from a retailer with $100B revenue
                    growing 3% yearly. Context matters.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Declining revenue:</strong> Shrinking sales usually signal competitive problems or market saturation</li>
                    <li><strong>Revenue growing but profit shrinking:</strong> Company may be slashing prices unsustainably</li>
                    <li><strong>One-time revenue spikes:</strong> Make sure growth is from core business, not asset sales</li>
                    <li><strong>Revenue concentration:</strong> If one customer represents 50%+ of sales, that's risky</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    Revenue is the starting point. From revenue, the company pays all its costs to reach
                    <strong> net income</strong> (profit). The ratio between them is the <strong>profit margin</strong>.
                  </p>
                  <p>
                    High revenue with negative profit means the business model might be flawed. Check
                    <strong> sales growth</strong> to see if revenue is trending up or down.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'salesGrowth' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Sales growth</strong> shows how much a company's revenue has increased
                    (or decreased) compared to the previous year, expressed as a percentage.
                  </p>
                  <p>
                    It's calculated as: (This Year's Revenue - Last Year's Revenue) ÷ Last Year's Revenue × 100.
                    Positive numbers mean growth, negative numbers mean decline.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Consistent sales growth indicates strong market demand, effective strategy, and competitive
                    advantage. Growth companies can reinvest in expansion and potentially increase stock value.
                  </p>
                  <p>
                    Investors pay premium prices for high-growth companies. The stock market often rewards
                    growth more than current profitability, especially in tech sectors.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">Growth expectations vary dramatically by industry and company lifecycle:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Mature companies (0-5% growth):</strong> Normal for established giants like utilities or consumer staples</li>
                    <li><strong>Steady growers (5-15% growth):</strong> Healthy for most established companies. Sustainable long-term.</li>
                    <li><strong>High growth (15-30% growth):</strong> Impressive but may slow as company scales. Common in successful tech companies.</li>
                    <li><strong>Hyper-growth (30%+ growth):</strong> Exciting but often unsustainable. Common in startups. High risk/reward.</li>
                  </ul>
                  <p className="mt-2">
                    Compare to industry averages. Retail growing 5% might be great, but software growing 5% could signal problems.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Negative growth (declining sales):</strong> May indicate losing market share or fading demand</li>
                    <li><strong>Slowing growth trend:</strong> If growth goes from 40% → 25% → 15%, the company is decelerating</li>
                    <li><strong>Growth from acquisitions only:</strong> Buying revenue isn't the same as organic growth</li>
                    <li><strong>Growth slower than industry:</strong> Competitors are winning, this company is losing ground</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    Sales growth affects all other metrics. Fast revenue growth can mask profitability issues—check
                    <strong> profit margin</strong> to ensure the company isn't sacrificing profits for growth.
                  </p>
                  <p>
                    Also check <strong>total debt</strong>: companies sometimes fuel growth by borrowing heavily,
                    which adds risk. Sustainable growth should come from strong business fundamentals, not just debt.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'netIncome' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Net income</strong> (also called "profit" or "bottom line") is what's
                    left after subtracting all expenses, taxes, and costs from revenue.
                  </p>
                  <p>
                    It's calculated as: Revenue - Operating Expenses - Interest - Taxes = Net Income.
                    This is the actual money the company earned for shareholders.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Net income is the ultimate measure of profitability. Companies use profits to pay dividends,
                    buy back stock, invest in growth, or save for future needs. Without profit, a company can't
                    survive long-term.
                  </p>
                  <p>
                    Stock valuations are often based on profit multiples (like P/E ratio). Higher net income
                    typically means higher stock prices, assuming consistent earnings.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">Profit standards vary by industry and growth stage:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Positive & growing:</strong> The baseline. Consistent profit growth is ideal.</li>
                    <li><strong>Compare to revenue:</strong> Check profit margin—is profit growing faster than sales?</li>
                    <li><strong>Industry context:</strong> Software companies often have 20-30% margins, retailers 2-5%</li>
                    <li><strong>Trend matters more than absolute value:</strong> Growing profit is better than large but stagnant profit</li>
                  </ul>
                  <p className="mt-2">
                    Negative net income (losses) isn't automatically bad for young/growth companies reinvesting heavily,
                    but established companies should be profitable.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Declining profits despite growing revenue:</strong> Costs are rising faster than sales</li>
                    <li><strong>Chronic losses:</strong> Company burning cash without path to profitability is risky</li>
                    <li><strong>Profit volatility:</strong> Earnings swinging wildly quarter-to-quarter signals instability</li>
                    <li><strong>One-time gains inflating profit:</strong> Asset sales can temporarily boost net income</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    Net income divided by <strong>revenue</strong> gives you <strong>profit margin</strong>—how
                    efficiently the company converts sales into profit.
                  </p>
                  <p>
                    High profit with high <strong>debt</strong> may be unsustainable if interest costs rise. Strong
                    net income supports dividends and reduces need for debt financing.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'profitMargin' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Profit margin</strong> shows what percentage of revenue becomes actual
                    profit. It's calculated by dividing net income by revenue, then multiplying by 100.
                  </p>
                  <p>
                    Formula: (Net Income ÷ Revenue) × 100 = Profit Margin%. For example, if a company
                    earns $100M revenue and $25M profit, the margin is 25%.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Profit margin reveals business efficiency and pricing power. High margins mean the company
                    keeps more of each dollar earned. This leaves more money for growth, dividends, or surviving
                    downturns.
                  </p>
                  <p>
                    Margins also indicate competitive advantage—companies with strong brands or unique products
                    can charge higher prices and maintain better margins than commodity businesses.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">Profit margins vary dramatically by industry:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Software/Tech (20-40%):</strong> High margins due to low marginal costs</li>
                    <li><strong>Healthcare/Pharma (15-25%):</strong> Strong IP protection allows premium pricing</li>
                    <li><strong>Consumer Goods (5-15%):</strong> Moderate margins with scale advantages</li>
                    <li><strong>Retail/Grocery (2-5%):</strong> Thin margins, rely on high volume</li>
                    <li><strong>Airlines/Hospitality (0-5%):</strong> Very thin margins, highly competitive</li>
                  </ul>
                  <p className="mt-2">
                    Compare to industry peers, not across sectors. A 15% margin is excellent for automotive
                    but poor for software. Look for margins stable or improving over time.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Shrinking margins:</strong> May indicate pricing pressure, rising costs, or losing competitive edge</li>
                    <li><strong>Margins far below industry average:</strong> Company may have operational problems</li>
                    <li><strong>Negative margins:</strong> Company loses money on every sale—unsustainable</li>
                    <li><strong>Volatile margins:</strong> Wildly fluctuating margins suggest unstable business</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    Profit margin connects <strong>revenue</strong> and <strong>net income</strong>. A company
                    can grow revenue but shrink margins if costs rise faster than sales.
                  </p>
                  <p>
                    High margins provide cushion for <strong>debt</strong> payments and economic downturns. Companies
                    with thin margins are more vulnerable to cost increases and competition.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'totalDebt' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Total debt</strong> is the sum of all money the company owes, including
                    bank loans, bonds, credit lines, and other financial obligations.
                  </p>
                  <p>
                    It includes both short-term debt (due within 1 year) and long-term debt (due beyond 1 year).
                    This is money that must eventually be repaid with interest.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    Debt can accelerate growth when used wisely, but too much debt increases risk. Companies
                    must make interest payments regardless of profit, and debt eventually must be repaid or
                    refinanced.
                  </p>
                  <p>
                    During economic downturns or if revenue drops, high debt can force companies into bankruptcy.
                    Investors evaluate debt levels to assess financial stability and risk.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">Debt levels should be evaluated relative to company size and cash generation:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Compare to revenue:</strong> Debt exceeding annual revenue can be concerning</li>
                    <li><strong>Compare to profit:</strong> Can the company pay down debt from yearly earnings?</li>
                    <li><strong>Debt-to-Equity ratio:</strong> Debt should be less than shareholders' equity for most companies</li>
                    <li><strong>Industry norms vary:</strong> Capital-intensive businesses (utilities, telecom) typically carry more debt</li>
                  </ul>
                  <p className="mt-2">
                    Low debt (or zero debt) provides flexibility and safety. Companies like Apple maintain minimal
                    debt despite having the capacity to borrow, prioritizing financial security.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Rapidly increasing debt:</strong> Company may be struggling to fund operations from revenue</li>
                    <li><strong>Debt exceeding market cap:</strong> Debt larger than company value is very risky</li>
                    <li><strong>High debt with low profit:</strong> Company may struggle to make interest payments</li>
                    <li><strong>Short-term debt spike:</strong> Large amounts due soon create refinancing risk</li>
                    <li><strong>Debt growing faster than revenue:</strong> Borrowing to fund operations, not growth</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    Debt must be serviced from <strong>net income</strong>. High debt with low profit is dangerous.
                    Compare debt to <strong>revenue</strong> and <strong>market cap</strong> for context on manageability.
                  </p>
                  <p>
                    High <strong>profit margins</strong> make debt less risky—the company generates plenty of cash to
                    cover interest. Companies often use debt to fuel <strong>sales growth</strong>, but this only works
                    if the growth is profitable.
                  </p>
                </div>
              </>
            )}
            {metricKey === 'peRatio' && (
              <>
                {/* What It Is */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What It Is</h3>
                  <p className="mb-2">
                    <strong>Price-to-Earnings (P/E) Ratio</strong> shows how much investors are willing to pay for each
                    dollar of a company's annual earnings. It's calculated by dividing the company's market cap by its net income
                    (or stock price by earnings per share).
                  </p>
                  <p>
                    For example, a P/E of 30 means investors pay $30 for every $1 of annual profit. It's one of the most
                    widely-used valuation metrics to determine if a stock is expensive or cheap relative to its earnings.
                  </p>
                </div>

                {/* Why Investors Care */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Why Investors Care</h3>
                  <p className="mb-2">
                    P/E Ratio helps investors determine if a stock is overvalued or undervalued. A high P/E suggests
                    investors expect strong future growth, while a low P/E might indicate the stock is undervalued—or
                    that the company faces challenges.
                  </p>
                  <p>
                    It's most useful when comparing companies in the same industry or tracking how market sentiment
                    about a company changes over time. Different industries have different "normal" P/E ranges based
                    on their growth prospects and risk profiles.
                  </p>
                </div>

                {/* What's a Good Value */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's a Good Value?</h3>
                  <p className="mb-2">P/E Ratios vary widely by industry and growth stage:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Low P/E (5-15):</strong> Mature/slow-growth companies, value stocks, banks, utilities</li>
                    <li><strong>Moderate P/E (15-25):</strong> Established profitable companies with steady growth</li>
                    <li><strong>High P/E (25-40):</strong> Growth companies, tech stocks with strong future expectations</li>
                    <li><strong>Very High P/E (40+):</strong> High-growth or speculative stocks with premium valuations</li>
                  </ul>
                  <p className="mt-2">
                    A "good" P/E depends on growth rate. A fast-growing tech company with a P/E of 35 might be fairly valued,
                    while a slow-growing utility with a P/E of 20 could be expensive. Always compare to industry peers.
                  </p>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Red Flags to Watch For</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Extremely high P/E (100+):</strong> Stock may be in a speculative bubble or overvalued</li>
                    <li><strong>P/E much higher than industry average:</strong> Market expectations may be unrealistic</li>
                    <li><strong>Rising P/E with flat earnings:</strong> Price increasing faster than profits—valuation risk</li>
                    <li><strong>Negative P/E:</strong> Company is losing money (no earnings to support stock price)</li>
                    <li><strong>P/E based on one-time gains:</strong> Inflated earnings from asset sales, not recurring business</li>
                  </ul>
                </div>

                {/* How It Relates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How This Relates to Other Metrics</h3>
                  <p className="mb-2">
                    P/E Ratio is directly calculated from <strong>market cap</strong> and <strong>net income</strong>.
                    Higher <strong>profit margins</strong> and strong <strong>sales growth</strong> often justify higher P/E ratios
                    because they signal the company can grow earnings faster.
                  </p>
                  <p>
                    Companies with low debt tend to have more stable P/E ratios, while heavily indebted companies may see
                    P/E volatility during economic stress. P/E should be used alongside other metrics—a low P/E doesn't
                    automatically mean "buy" if the business fundamentals are deteriorating.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
