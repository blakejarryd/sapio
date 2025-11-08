import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatYear,
  getGrowthColor
} from './formatters'

describe('formatNumber', () => {
  it('formats trillions correctly', () => {
    expect(formatNumber(1_500_000_000_000)).toBe('1.5T')
  })

  it('formats billions correctly', () => {
    expect(formatNumber(789_500_000_000)).toBe('789.5B')
  })

  it('formats millions correctly', () => {
    expect(formatNumber(96_773_000)).toBe('96.8M')
  })

  it('formats thousands correctly', () => {
    expect(formatNumber(5_250)).toBe('5.3K')
  })

  it('formats small numbers correctly', () => {
    expect(formatNumber(500)).toBe('500')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-2_722_000_000)).toBe('-2.7B')
  })
})

describe('formatCurrency', () => {
  it('formats USD currency by default', () => {
    expect(formatCurrency(789_500_000_000)).toBe('$789.5B')
  })

  it('formats other currencies', () => {
    expect(formatCurrency(1_000_000_000, 'EUR')).toBe('1.0B EUR')
  })
})

describe('formatPercentage', () => {
  it('formats positive percentages with plus sign', () => {
    expect(formatPercentage(18.8)).toBe('+18.8%')
  })

  it('formats negative percentages', () => {
    expect(formatPercentage(-2.8)).toBe('-2.8%')
  })

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.0%')
  })
})

describe('formatYear', () => {
  it('formats year as string', () => {
    expect(formatYear(2024)).toBe('2024')
  })
})

describe('getGrowthColor', () => {
  it('returns green for positive growth', () => {
    expect(getGrowthColor(10.5)).toBe('text-green-600')
  })

  it('returns red for negative growth', () => {
    expect(getGrowthColor(-5.2)).toBe('text-red-600')
  })

  it('returns gray for zero growth', () => {
    expect(getGrowthColor(0)).toBe('text-gray-600')
  })
})
