/**
 * Educational tooltip content for property investors
 * Bridges familiar property investment concepts to stock market terminology
 */

export const tooltipContent = {
  profitability: (
    <div>
      <div className="font-semibold mb-1">Is This Business Making Money?</div>
      <div className="text-xs leading-relaxed">
        Think of this like a rental property. A profitable company generates positive income after all expenses, similar to positive cash flow from rent after mortgage, rates, and maintenance.
      </div>
    </div>
  ),

  revenue: (
    <div>
      <div className="font-semibold mb-1">Revenue (Total Income)</div>
      <div className="text-xs leading-relaxed">
        The total money the company receives from selling products or services, before any costs. Similar to gross rental income before expenses.
      </div>
    </div>
  ),

  earnings: (
    <div>
      <div className="font-semibold mb-1">Earnings (Net Profit)</div>
      <div className="text-xs leading-relaxed">
        The actual profit after all expenses are paid. This is like your net rental income after mortgage, rates, insurance, and maintenance. A company can have high revenue but still lose money if expenses are too high.
      </div>
    </div>
  ),

  profitMargin: (
    <div>
      <div className="font-semibold mb-1">Profit Margin</div>
      <div className="text-xs leading-relaxed">
        How much of each dollar of revenue becomes profit. For example, a 20% margin means for every $100 in sales, the company keeps $20 as profit. Higher is generally better.
      </div>
    </div>
  ),

  roe: (
    <div>
      <div className="font-semibold mb-1">Return on Equity (ROE)</div>
      <div className="text-xs leading-relaxed">
        Similar to rental yield in property. Shows how efficiently the company uses shareholder money to generate profit. A 15% ROE means the company generates $15 profit for every $100 of shareholder equity.
      </div>
    </div>
  ),

  cashFlow: (
    <div>
      <div className="font-semibold mb-1">Operating Cash Flow</div>
      <div className="text-xs leading-relaxed">
        Actual cash generated from business operations, not accounting profits. Like checking if rent is actually being paid and deposited, not just promised. Positive cash flow means the business is generating real money.
      </div>
    </div>
  ),

  debtToEquity: (
    <div>
      <div className="font-semibold mb-1">Debt-to-Equity Ratio</div>
      <div className="text-xs leading-relaxed">
        Similar to LVR (Loan-to-Value Ratio) in property. Shows how much debt the company has compared to shareholder equity. Lower is generally safer. 1.0 means equal debt and equity; above 2.0 is considered high.
      </div>
    </div>
  ),

  capitalRaise: (
    <div>
      <div className="font-semibold mb-1">Capital Raises (Equity Dilution)</div>
      <div className="text-xs leading-relaxed">
        When a company issues new shares to raise money, existing shareholders own a smaller percentage of the company. Frequent raises can indicate the business isn't self-sustaining from profits.
      </div>
    </div>
  ),

  cagr: (
    <div>
      <div className="font-semibold mb-1">CAGR (Compound Annual Growth Rate)</div>
      <div className="text-xs leading-relaxed">
        The average annual growth rate over time. Like calculating property value appreciation over 10 years. A 10% CAGR means the value grew an average of 10% per year.
      </div>
    </div>
  ),

  marketCap: (
    <div>
      <div className="font-semibold mb-1">Market Capitalization</div>
      <div className="text-xs leading-relaxed">
        The total value of all company shares. Like the total market value of all properties in a portfolio. Calculated as share price multiplied by total shares outstanding.
      </div>
    </div>
  ),

  peRatio: (
    <div>
      <div className="font-semibold mb-1">Price-to-Earnings Ratio (P/E)</div>
      <div className="text-xs leading-relaxed">
        How many years of current profit you're paying for when buying shares. Similar to asking "How many years of rent would it take to pay back the property price?" A P/E of 20 means you're paying 20 times annual profit.
      </div>
    </div>
  ),

  yoyGrowth: (
    <div>
      <div className="font-semibold mb-1">Year-over-Year Growth</div>
      <div className="text-xs leading-relaxed">
        How much revenue or profit grew compared to the same time last year. Like comparing this year's rental income to last year's. Helps identify if the business is expanding or contracting.
      </div>
    </div>
  ),

  operatingIncome: (
    <div>
      <div className="font-semibold mb-1">Operating Income</div>
      <div className="text-xs leading-relaxed">
        Profit from core business operations before interest and taxes. Like rental income minus property-specific costs, but before loan interest. Shows if the core business is healthy.
      </div>
    </div>
  ),

  shareholderEquity: (
    <div>
      <div className="font-semibold mb-1">Shareholder Equity</div>
      <div className="text-xs leading-relaxed">
        The net value that belongs to shareholders (Assets minus Liabilities). Like the equity you have in a property after subtracting the mortgage. Your actual ownership stake.
      </div>
    </div>
  ),

  revenueStreams: (
    <div>
      <div className="font-semibold mb-1">Revenue Streams</div>
      <div className="text-xs leading-relaxed">
        Different ways the company makes money. Like having rental income plus parking fees from a property. Diversified streams reduce risk if one source declines.
      </div>
    </div>
  ),

  preProfit: (
    <div>
      <div className="font-semibold mb-1">Pre-Profit Company</div>
      <div className="text-xs leading-relaxed">
        The company has revenue but isn't making profit yet. Like a development property still under construction - generating some rental but not enough to cover all costs. Higher risk but potential upside if they become profitable.
      </div>
    </div>
  ),

  preRevenue: (
    <div>
      <div className="font-semibold mb-1">Pre-Revenue Company</div>
      <div className="text-xs leading-relaxed">
        The company hasn't started selling products yet. Like buying land before building - purely speculative. Very high risk. These companies survive on capital raises until they can generate revenue.
      </div>
    </div>
  ),

  dividendYield: (
    <div>
      <div className="font-semibold mb-1">Dividend Yield</div>
      <div className="text-xs leading-relaxed">
        The annual dividend income you receive per dollar invested, expressed as a percentage. Like rental yield on a property. A 4% dividend yield means you receive $4 per year for every $100 invested.
      </div>
    </div>
  ),

  payoutRatio: (
    <div>
      <div className="font-semibold mb-1">Payout Ratio</div>
      <div className="text-xs leading-relaxed">
        The percentage of earnings paid out as dividends. A 60% ratio means the company pays 60% of profits to shareholders and reinvests 40% in growth. Lower ratios indicate more room for dividend increases.
      </div>
    </div>
  ),

  dividendConsistency: (
    <div>
      <div className="font-semibold mb-1">Payment Consistency</div>
      <div className="text-xs leading-relaxed">
        Years of uninterrupted dividend payments. Like a tenant who always pays rent on time. More consecutive years indicates reliable passive income and business stability.
      </div>
    </div>
  ),

  dividendGrowth: (
    <div>
      <div className="font-semibold mb-1">Dividend Growth</div>
      <div className="text-xs leading-relaxed">
        How fast dividends have grown over time. Like annual rent increases. Positive growth means your income stream is increasing, helping offset inflation.
      </div>
    </div>
  )
}
