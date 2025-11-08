import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MetricTile from './MetricTile'
import { Metric } from '../types/company'

const mockMetric: Metric = {
  value: 789500000000,
  displayValue: '$789.5B',
  description: 'The total value of all company shares',
  historical: [
    { year: 2020, value: 669000000000 },
    { year: 2021, value: 1056000000000 },
    { year: 2022, value: 386000000000 },
    { year: 2023, value: 789000000000 },
    { year: 2024, value: 789500000000 },
  ],
}

describe('MetricTile', () => {
  it('renders metric information correctly', () => {
    render(
      <BrowserRouter>
        <MetricTile metricKey="marketCap" metric={mockMetric} ticker="TSLA" />
      </BrowserRouter>
    )

    expect(screen.getByText('Company Value')).toBeInTheDocument()
    expect(screen.getByText('$789.5B')).toBeInTheDocument()
    expect(screen.getByText('The total value of all company shares')).toBeInTheDocument()
  })

  it('displays the correct icon', () => {
    render(
      <BrowserRouter>
        <MetricTile metricKey="marketCap" metric={mockMetric} ticker="TSLA" />
      </BrowserRouter>
    )

    expect(screen.getByText('🏢')).toBeInTheDocument()
  })
})
