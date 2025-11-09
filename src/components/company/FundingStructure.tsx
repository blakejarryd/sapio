import React from 'react'
import { CapitalRaise } from '../../types/company'
import { Card, TooltipLabel } from '../ui'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { tooltipContent } from '../../utils/tooltipContent'

interface FundingStructureProps {
  debtToEquity: number
  capitalRaises: CapitalRaise[]
  currency: string
}

export const FundingStructure: React.FC<FundingStructureProps> = ({
  debtToEquity,
  capitalRaises,
  currency
}) => {
  // Calculate debt and equity percentages
  const equityPercentage = (1 / (1 + debtToEquity)) * 100
  const debtPercentage = (debtToEquity / (1 + debtToEquity)) * 100

  const getDebtLevel = () => {
    if (debtToEquity <= 0.3) return { label: 'Conservative', color: 'text-profit' }
    if (debtToEquity <= 0.6) return { label: 'Moderate', color: 'text-status-warning' }
    return { label: 'Highly Leveraged', color: 'text-loss' }
  }

  const debtLevel = getDebtLevel()

  const totalRaised = capitalRaises.reduce((sum, raise) => sum + raise.amountRaised, 0)

  return (
    <Card>
      <h3 className="text-h3 text-slate-900 mb-4">Funding Structure</h3>

      {/* Debt vs Equity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <TooltipLabel
            label="Debt to Equity Ratio"
            tooltip={tooltipContent.debtToEquity}
            className="text-sm text-slate-600"
          />
          <span className={`text-sm font-semibold ${debtLevel.color}`}>
            {debtLevel.label}
          </span>
        </div>

        {/* Visual bar */}
        <div className="h-8 flex rounded-lg overflow-hidden bg-slate-100">
          <div
            className="bg-accent flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${equityPercentage}%` }}
          >
            {equityPercentage > 15 && `${equityPercentage.toFixed(0)}% Equity`}
          </div>
          <div
            className="bg-slate-400 flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${debtPercentage}%` }}
          >
            {debtPercentage > 15 && `${debtPercentage.toFixed(0)}% Debt`}
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-2">
          Debt/Equity: {debtToEquity.toFixed(2)}
        </div>
      </div>

      {/* Capital Raising History */}
      <div>
        <TooltipLabel
          label="Capital Raising History"
          tooltip={tooltipContent.capitalRaise}
          className="text-sm font-semibold text-slate-900 mb-3"
        />

        {capitalRaises.length > 0 ? (
          <>
            <div className="space-y-3 mb-3">
              {capitalRaises.map((raise, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {raise.type}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDate(raise.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-slate-900">
                      {formatCurrency(raise.amountRaised, raise.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total raised:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(totalRaised, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-slate-600">Number of raises:</span>
                <span className="font-medium text-slate-900">
                  {capitalRaises.length}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-profit/5 border border-profit/20 rounded-lg p-3 text-sm text-profit">
            No equity capital raises recorded (self-funded growth)
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Frequent capital raising dilutes ownership. Companies growing without raising capital
        demonstrate strong cash generation.
      </p>
    </Card>
  )
}
