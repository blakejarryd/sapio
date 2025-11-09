# Financial Data API Research & Architecture Strategy

**Date:** November 2025
**Purpose:** Evaluate backend data solutions for Sapio's stock analysis platform

---

## Executive Summary

This document evaluates financial data API providers and architectural strategies for implementing real-time stock market data in Sapio. Based on our requirements (10 years of financial history, dividends, fundamentals, company info), we recommend:

1. **Data Provider:** Financial Modeling Prep (FMP) - Best balance of cost, data quality, and fundamental coverage
2. **Architecture:** Periodic database caching with daily updates for fundamental data
3. **Estimated Cost:** $14-19/month for starter tier (sufficient for 10,000+ monthly users)

---

## Our Data Requirements

Based on our current implementation in `src/types/company.ts`, we need:

### Core Fundamentals (10-year history)
- Revenue, Earnings, Operating Cash Flow
- Total Assets, Total Liabilities, Shareholder Equity
- Calculated metrics: ROE, Profit Margin, CAGR

### Company Information
- Ticker, Name, Exchange, Sector, Industry
- Current share price, Market cap, Shares outstanding
- Business description, headquarters, employee count
- Revenue streams and key products

### Dividend Data
- 10-year dividend payment history
- Current dividend yield
- Payout ratio, consecutive years, CAGR

### Capital Structure
- Historical capital raises (IPO, placements, rights issues)
- Current debt-to-equity ratio

### Update Frequency Needs
- **Fundamental data:** Daily is sufficient (changes quarterly)
- **Stock prices:** 15-minute delay acceptable for our use case
- **Dividends:** Quarterly updates adequate
- **Company info:** Monthly updates sufficient

---

## Financial Data Providers Comparison

### 1. Financial Modeling Prep (FMP) ⭐ **RECOMMENDED**

**Pricing:**
- **Free Tier:** 250 API calls/day, 500MB bandwidth/30 days
- **Starter:** $14/month - 750 calls/day, 20GB bandwidth
- **Professional:** $29/month - 2,000 calls/day, 50GB bandwidth
- **Enterprise:** $99/month - Unlimited calls, 150GB bandwidth

**Strengths:**
✅ Excellent fundamental data coverage (100+ data points)
✅ 30+ years of historical financial data
✅ Comprehensive dividend history
✅ Financial statements (Income, Balance Sheet, Cash Flow)
✅ Calculated ratios included (P/E, ROE, etc.)
✅ Coverage: 70,000+ companies globally
✅ Very affordable for fundamental analysis use case
✅ Well-documented API with good examples
✅ CSV and JSON support

**Weaknesses:**
❌ Not ideal for real-time tick-by-tick trading data
❌ Free tier very limited for production use

**Best For:** Our use case - fundamental analysis for property investors

**Example Endpoints:**
```
GET /api/v3/income-statement/{ticker}
GET /api/v3/balance-sheet-statement/{ticker}
GET /api/v3/cash-flow-statement/{ticker}
GET /api/v3/key-metrics/{ticker}
GET /api/v3/ratios/{ticker}
GET /api/v3/profile/{ticker}
GET /api/v3/historical-price-full/{ticker}
```

---

### 2. Alpha Vantage

**Pricing:**
- **Free Tier:** 25 calls/day (some sources say 500/day)
- **Premium:** $29.99-49.99/month for 75+ requests/minute

**Strengths:**
✅ Official NASDAQ vendor (trusted data source)
✅ Generous free tier (if 500 calls/day)
✅ Good fundamental data coverage
✅ Technical indicators included
✅ Real-time forex and crypto

**Weaknesses:**
❌ Conflicting information on free tier limits (25 vs 500 calls)
❌ More expensive than FMP for similar features
❌ Free tier insufficient for production

**Best For:** Hobbyist projects or USD/month budget for real-time needs

---

### 3. Polygon.io

**Pricing:**
- **Free Tier:** Limited access, delayed data
- **Starter:** $199/month for full access
- **Premium:** Higher tiers for options, forex

**Strengths:**
✅ Excellent real-time data quality
✅ Comprehensive coverage (stocks, crypto, forex, options)
✅ WebSocket support for streaming
✅ Good documentation

**Weaknesses:**
❌ Very expensive ($199/month minimum for useful tier)
❌ Overkill for fundamental analysis use case
❌ Optimized for traders, not investors

**Best For:** High-frequency trading platforms, real-time apps

---

### 4. Finnhub

**Pricing:**
- **Free Tier:** 60 calls/minute (most generous rate limits)
- **Paid:** $49.99-200/month

**Strengths:**
✅ Best free tier rate limits (60 calls/min)
✅ Institutional-grade data quality
✅ Real-time stock prices
✅ Global fundamental data
✅ ETF holdings data

**Weaknesses:**
❌ Limited endpoints in free tier
❌ Lacks some basic features unless paid
❌ More expensive than FMP

**Best For:** Apps needing many API calls but basic data

---

### 5. EODHD (EOD Historical Data)

**Pricing:**
- **Starter:** $19.99/month
- **Higher tiers:** Up to several hundred/month

**Strengths:**
✅ Very affordable ($19.99/month)
✅ Historical data specialist
✅ Fundamental data included
✅ Stock screeners and economic calendars
✅ Good for backtesting

**Weaknesses:**
❌ Less popular than FMP (smaller community)
❌ Documentation not as comprehensive

**Best For:** Historical backtesting, European markets

---

### 6. Yahoo Finance (yfinance)

**Pricing:**
- **Free:** Unlimited (public scraping)

**Strengths:**
✅ Completely free
✅ Python library `yfinance` widely used
✅ Good coverage of major stocks
✅ Easy to use

**Weaknesses:**
❌ **Not suitable for production** - can break anytime
❌ No official API (scrapes public website)
❌ Yahoo can change structure without notice
❌ No SLA or support
❌ Rate limiting unclear
❌ Unreliable for business applications

**Best For:** Personal projects, prototyping only

---

## Architecture Strategy Comparison

### Option A: Direct API Calls on Page Load ❌ **NOT RECOMMENDED**

```
User Request → Frontend → Backend → External API → Backend → Frontend → User
```

**How it works:**
- User loads company page
- Backend fetches data from FMP/Alpha Vantage in real-time
- Response time: 500ms - 2000ms per request

**Pros:**
- Always current data
- Simple implementation
- No database needed initially

**Cons:**
- ❌ **Slow page loads** (500ms+ per company)
- ❌ **API rate limit issues** at scale
- ❌ **Expensive** - Every page view = API call
- ❌ **No offline capability**
- ❌ **Dependent on third-party uptime**
- ❌ **Difficult to add computed metrics**

**Cost Analysis:**
- 1,000 users/month × 10 page views = 10,000 API calls
- With FMP Starter ($14/month): 750 calls/day = 22,500 calls/month ✅ Would work
- With Alpha Vantage Free: 25 calls/day = 750 calls/month ❌ Insufficient
- At 10,000 users/month: 100,000 API calls → Need Enterprise plan

---

### Option B: Periodic Database Caching ⭐ **RECOMMENDED**

```
Scheduled Job → External API → Database ← Backend ← Frontend ← User
(Daily/Weekly)                    (Fast)   (Fast)    (Instant)
```

**How it works:**
- Scheduled job runs daily at market close (4pm ET)
- Fetches data for all tracked companies (~100-1000 stocks)
- Stores in PostgreSQL/MongoDB
- User requests served from database (< 100ms)

**Pros:**
- ✅ **Blazing fast page loads** (< 100ms)
- ✅ **Predictable API costs** (fixed daily calls)
- ✅ **Can handle unlimited users**
- ✅ **Add custom calculations** easily
- ✅ **Data validation** before showing to users
- ✅ **Offline capability** during API outages
- ✅ **Historical tracking** of data changes

**Cons:**
- Data delayed by up to 24 hours (acceptable for fundamentals)
- Requires database setup
- More complex initial architecture

**Cost Analysis:**
- Track 500 companies
- Daily update: 500 companies × 5 endpoints = 2,500 API calls/day
- FMP Starter: 750 calls/day ❌ Need Professional ($29/month)
- FMP Professional: 2,000 calls/day ❌ Need batch optimization
- **Optimized:** Batch endpoints → ~750 calls/day ✅ Fits Starter ($14/month)

**Update Schedule:**
```javascript
// Daily fundamentals update
0 18 * * 1-5  // 6pm ET weekdays (after market close)

// Weekly company info update
0 2 * * 0     // 2am Sunday

// Monthly dividend check
0 3 1 * *     // 3am 1st of month
```

---

### Option C: Hybrid Approach (Advanced)

```
Real-time prices → API → Frontend (for current price)
Everything else  → DB  → Frontend (for fundamentals)
```

**How it works:**
- Fundamentals cached in database (updated daily)
- Stock prices fetched real-time or 15-min delayed
- Best of both worlds

**Use Cases:**
- When you need current stock prices
- But fundamentals can be 24-hour old

**Cost:** Moderate (database + limited real-time API calls)

---

## Database Schema Recommendation

```sql
-- Companies table (updated monthly)
CREATE TABLE companies (
  ticker VARCHAR(10) PRIMARY KEY,
  company_name VARCHAR(255),
  exchange VARCHAR(50),
  sector VARCHAR(100),
  industry VARCHAR(100),
  description TEXT,
  headquarters VARCHAR(255),
  employees INTEGER,
  founded INTEGER,
  last_updated TIMESTAMP
);

-- Financial statements (updated daily)
CREATE TABLE financials (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) REFERENCES companies(ticker),
  year INTEGER,
  revenue BIGINT,
  earnings BIGINT,
  operating_cash_flow BIGINT,
  total_assets BIGINT,
  total_liabilities BIGINT,
  shareholder_equity BIGINT,
  updated_at TIMESTAMP
);

-- Dividends (updated quarterly)
CREATE TABLE dividends (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) REFERENCES companies(ticker),
  year INTEGER,
  dividend_per_share DECIMAL(10,4),
  currency VARCHAR(3),
  updated_at TIMESTAMP
);

-- Stock prices (updated 15-min or daily)
CREATE TABLE stock_prices (
  ticker VARCHAR(10) REFERENCES companies(ticker),
  price DECIMAL(10,2),
  market_cap BIGINT,
  shares_outstanding BIGINT,
  updated_at TIMESTAMP,
  PRIMARY KEY (ticker, updated_at)
);

-- Capital raises (static/manual entry)
CREATE TABLE capital_raises (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) REFERENCES companies(ticker),
  event_date DATE,
  type VARCHAR(50),
  amount_raised BIGINT,
  shares_before BIGINT,
  shares_after BIGINT,
  currency VARCHAR(3)
);
```

---

## Implementation Recommendations

### Phase 1: MVP (Months 1-2)
**Goal:** Get basic data flowing with minimal cost

1. **Data Provider:** Start with FMP Starter tier ($14/month)
2. **Architecture:** Periodic caching with daily updates
3. **Database:** PostgreSQL (free on Supabase/Railway/Render)
4. **Companies:** Track 50 popular stocks (AAPL, MSFT, GOOGL, etc.)
5. **Update Frequency:** Daily at 6pm ET

**Implementation Steps:**
```bash
# 1. Set up database
- Create PostgreSQL instance
- Run schema migrations
- Add indexes on ticker + year columns

# 2. Create data fetcher service
- Node.js script with node-cron
- Fetch from FMP API
- Transform to our schema
- Store in database

# 3. Update backend API
- Read from database instead of mock JSON
- Add caching layer (Redis optional)
- Return data in existing format

# 4. Deploy cron job
- Run on same server as backend
- Or use separate service (easier to scale)
```

**Estimated Costs:**
- FMP API: $14/month
- Database: $0 (Supabase free tier) or $5/month (Railway)
- **Total: $14-19/month**

---

### Phase 2: Growth (Months 3-6)
**Goal:** Handle more users and companies

1. **Upgrade to FMP Professional** ($29/month) if needed
2. **Track 200-500 companies**
3. **Add Redis caching** for frequently accessed data
4. **Implement ETL pipeline** for data quality checks
5. **Add webhook notifications** for quarterly earnings

**Estimated Costs:**
- FMP API: $29/month
- Database: $10/month (Railway/Render)
- Redis: $5/month (Upstash)
- **Total: $44/month**

---

### Phase 3: Scale (Months 6+)
**Goal:** Production-ready for thousands of users

1. **Track 1,000+ companies**
2. **Add real-time price updates** (15-min delay via WebSocket)
3. **Implement CDN** for static company data
4. **Data validation and alerts** for anomalies
5. **Multiple data source redundancy**

**Estimated Costs:**
- FMP API: $99/month (Enterprise)
- Database: $25/month (managed PostgreSQL)
- Redis: $10/month
- CDN: $10/month
- **Total: $144/month**

---

## Code Examples

### Data Fetcher Service (Node.js)

```typescript
// src/services/dataFetcher.ts
import cron from 'node-cron'
import { Pool } from 'pg'
import axios from 'axios'

const FMP_API_KEY = process.env.FMP_API_KEY
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3'

const db = new Pool({
  connectionString: process.env.DATABASE_URL
})

interface FinancialStatement {
  date: string
  symbol: string
  revenue: number
  netIncome: number
  operatingCashFlow: number
  totalAssets: number
  totalLiabilities: number
  totalStockholdersEquity: number
}

async function fetchFinancials(ticker: string) {
  const url = `${FMP_BASE_URL}/income-statement/${ticker}?period=annual&limit=10&apikey=${FMP_API_KEY}`
  const response = await axios.get<FinancialStatement[]>(url)
  return response.data
}

async function updateCompanyFinancials(ticker: string) {
  console.log(`Updating financials for ${ticker}...`)

  const data = await fetchFinancials(ticker)

  for (const statement of data) {
    const year = new Date(statement.date).getFullYear()

    await db.query(`
      INSERT INTO financials (
        ticker, year, revenue, earnings,
        operating_cash_flow, total_assets,
        total_liabilities, shareholder_equity,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (ticker, year)
      DO UPDATE SET
        revenue = EXCLUDED.revenue,
        earnings = EXCLUDED.earnings,
        operating_cash_flow = EXCLUDED.operating_cash_flow,
        total_assets = EXCLUDED.total_assets,
        total_liabilities = EXCLUDED.total_liabilities,
        shareholder_equity = EXCLUDED.shareholder_equity,
        updated_at = NOW()
    `, [
      ticker,
      year,
      statement.revenue,
      statement.netIncome,
      statement.operatingCashFlow,
      statement.totalAssets,
      statement.totalLiabilities,
      statement.totalStockholdersEquity
    ])
  }

  console.log(`✓ Updated ${data.length} years of data for ${ticker}`)
}

async function runDailyUpdate() {
  const companies = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN']

  for (const ticker of companies) {
    try {
      await updateCompanyFinancials(ticker)
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to update ${ticker}:`, error)
    }
  }

  console.log('Daily update complete!')
}

// Schedule daily updates at 6pm ET (22:00 UTC during DST)
cron.schedule('0 22 * * 1-5', () => {
  console.log('Starting scheduled data update...')
  runDailyUpdate()
})

// Run immediately on startup for testing
if (process.env.NODE_ENV === 'development') {
  runDailyUpdate()
}
```

### Backend API Updates

```typescript
// src/services/api.ts (update to use database)
import { Pool } from 'pg'
import { CompanyData } from '../types/company'

const db = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function fetchCompanyData(ticker: string): Promise<CompanyData> {
  // Fetch from database instead of JSON files
  const companyQuery = await db.query(`
    SELECT * FROM companies WHERE ticker = $1
  `, [ticker])

  if (companyQuery.rows.length === 0) {
    throw new Error(`Company ${ticker} not found`)
  }

  const company = companyQuery.rows[0]

  const financialsQuery = await db.query(`
    SELECT * FROM financials
    WHERE ticker = $1
    ORDER BY year DESC
    LIMIT 10
  `, [ticker])

  const dividendsQuery = await db.query(`
    SELECT * FROM dividends
    WHERE ticker = $1
    ORDER BY year DESC
    LIMIT 10
  `, [ticker])

  const priceQuery = await db.query(`
    SELECT * FROM stock_prices
    WHERE ticker = $1
    ORDER BY updated_at DESC
    LIMIT 1
  `, [ticker])

  // Transform database records to CompanyData format
  return {
    ticker: company.ticker,
    companyName: company.company_name,
    exchange: company.exchange,
    sector: company.sector,
    industry: company.industry,
    currentSharePrice: priceQuery.rows[0]?.price || 0,
    financials: financialsQuery.rows.map(f => ({
      year: f.year,
      revenue: f.revenue,
      earnings: f.earnings,
      // ... etc
    })),
    dividends: {
      paysDividend: dividendsQuery.rows.length > 0,
      dividendHistory: dividendsQuery.rows.map(d => ({
        year: d.year,
        dividendPerShare: d.dividend_per_share,
        currency: d.currency
      })),
      // ... etc
    },
    // ... rest of fields
  }
}
```

---

## Risk Mitigation

### API Rate Limiting
**Risk:** Hitting rate limits during high traffic
**Mitigation:**
- Implement exponential backoff
- Queue system for batch updates
- Monitor usage with alerts at 80% capacity

### Data Quality
**Risk:** Incorrect or stale data
**Mitigation:**
- Validate data before storing (sanity checks)
- Track data freshness timestamps
- Alert on failed updates
- Keep 2-3 day historical backup

### Provider Outages
**Risk:** FMP API down
**Mitigation:**
- Serve from database cache (data is <24hrs old anyway)
- Have backup provider API keys ready (Alpha Vantage)
- Monitor uptime with status checks

### Cost Overruns
**Risk:** Unexpected API charges
**Mitigation:**
- Set up billing alerts in FMP dashboard
- Implement circuit breaker pattern
- Cache aggressively
- Monitor usage daily

---

## Decision Matrix

| Factor | Direct API | Periodic Cache | Hybrid |
|--------|-----------|----------------|--------|
| **Page Load Speed** | ❌ Slow (500ms+) | ✅ Fast (<100ms) | ✅ Fast (<100ms) |
| **Data Freshness** | ✅ Real-time | ⚠️ 24-hr delay | ✅ 15-min delay |
| **Cost at 1K users** | ❌ $29-99/mo | ✅ $14/mo | ⚠️ $29/mo |
| **Cost at 10K users** | ❌ $99+/mo | ✅ $14-29/mo | ⚠️ $99/mo |
| **Implementation** | ✅ Simple | ⚠️ Moderate | ❌ Complex |
| **Scalability** | ❌ Poor | ✅ Excellent | ✅ Good |
| **Reliability** | ❌ Depends on API | ✅ High | ⚠️ Moderate |
| **Our Use Case Fit** | ❌ Poor | ✅ Excellent | ⚠️ Overkill |

---

## Final Recommendation

### Data Provider: **Financial Modeling Prep**
- Start with Starter tier ($14/month)
- Best value for fundamental data
- Excellent documentation
- Reliable and trusted

### Architecture: **Periodic Database Caching**
- Daily updates at market close
- PostgreSQL for storage
- Serves unlimited users for fixed cost
- Fundamental data doesn't need real-time updates

### Timeline:
- **Week 1-2:** Set up PostgreSQL database
- **Week 3-4:** Build data fetcher service
- **Week 5-6:** Update backend API to use database
- **Week 7-8:** Testing and optimization

### Budget:
- **Month 1-6:** $14-19/month (FMP Starter + Database)
- **Month 6-12:** $29-44/month as we add more stocks
- **Year 2+:** $99-144/month at scale

This approach gives us production-ready infrastructure at minimal cost while maintaining fast page loads and reliable service for our property investor audience.

---

## Next Steps

1. **Sign up for FMP Starter plan** and test API endpoints
2. **Set up PostgreSQL database** (recommend Supabase free tier to start)
3. **Build data fetcher prototype** for 10 test companies
4. **Measure performance** - page load times before/after
5. **Document API transformation** from FMP format to our schema
6. **Create monitoring dashboard** for data freshness
7. **Plan migration** from mock JSON files to database

---

## References

- [Financial Modeling Prep Documentation](https://site.financialmodelingprep.com/developer/docs)
- [API Caching Best Practices](https://blog.logrocket.com/caching-strategies-to-speed-up-your-api/)
- [Stock Market API Comparison 2025](https://medium.com/coinmonks/the-7-best-financial-apis-for-investors-and-developers-in-2025-in-depth-analysis-and-comparison-adbc22024f68)
- PostgreSQL Performance Tuning Guide
- Redis Caching Strategies
