import { CompanyData, CompanySearchResult } from '../types/company'

const API_BASE_URL = '/api'
const SIMULATED_LATENCY = 500 // milliseconds

/**
 * Simulate network latency for realistic UX testing
 */
async function simulateLatency(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, SIMULATED_LATENCY))
}

/**
 * Search for companies by name or ticker
 */
export async function searchCompanies(query: string): Promise<CompanySearchResult[]> {
  await simulateLatency()

  try {
    const response = await fetch(`${API_BASE_URL}/companies.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch companies')
    }

    const companies: CompanySearchResult[] = await response.json()

    // Filter companies based on search query
    if (!query) {
      return companies
    }

    const lowerQuery = query.toLowerCase()
    return companies.filter(
      company =>
        company.ticker.toLowerCase().includes(lowerQuery) ||
        company.companyName.toLowerCase().includes(lowerQuery)
    )
  } catch (error) {
    console.error('Error searching companies:', error)
    throw error
  }
}

/**
 * Fetch complete company data including all metrics
 */
export async function fetchCompanyData(ticker: string): Promise<CompanyData> {
  await simulateLatency()

  try {
    const response = await fetch(`${API_BASE_URL}/companies/${ticker}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`)
    }

    const data: CompanyData = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching company data for ${ticker}:`, error)
    throw error
  }
}

/**
 * Check if a company exists
 */
export async function companyExists(ticker: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/companies/${ticker}.json`, { method: 'HEAD' })
    return true
  } catch {
    return false
  }
}
