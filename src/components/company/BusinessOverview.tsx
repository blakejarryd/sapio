import React from 'react'
import { BusinessModel } from '../../types/company'
import { Card } from '../ui'

interface BusinessOverviewProps {
  businessModel: BusinessModel
  currency: string
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  businessModel
}) => {
  return (
    <Card>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Business Overview</h2>

      {/* Company Description */}
      <p className="text-base text-slate-700 leading-relaxed mb-6">
        {businessModel.description}
      </p>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 px-4 py-3 rounded-md">
          <div className="text-xs text-slate-500 mb-1">Founded</div>
          <div className="text-sm font-medium text-slate-900">
            {businessModel.founded}
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 rounded-md">
          <div className="text-xs text-slate-500 mb-1">Headquarters</div>
          <div className="text-sm font-medium text-slate-900">
            {businessModel.headquarters}
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 rounded-md">
          <div className="text-xs text-slate-500 mb-1">Employees</div>
          <div className="text-sm font-medium text-slate-900">
            {businessModel.employees.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 rounded-md">
          <div className="text-xs text-slate-500 mb-1">Markets</div>
          <div className="text-sm font-medium text-slate-900">
            {businessModel.markets.length} regions
          </div>
        </div>
      </div>

      {/* Revenue Model and Products Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Model */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-3">
            Revenue Model
          </h3>
          <ul className="space-y-3">
            {businessModel.revenueStreams.map((stream, index) => (
              <li key={index} className="text-sm">
                <div className="font-medium text-slate-900">
                  {stream.name} ({stream.percentageOfRevenue}%)
                </div>
                <div className="text-slate-600 mt-1">{stream.description}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Products */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-3">
            Key Products & Services
          </h3>
          <ul className="space-y-3">
            {businessModel.keyProducts.map((product, index) => (
              <li key={index} className="text-sm">
                <div className="font-medium text-slate-900">{product.name}</div>
                <div className="text-slate-600 mt-1">{product.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
