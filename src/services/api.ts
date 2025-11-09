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
      if (response.status >= 500) {
        throw new Error('Server error: Unable to load company list. Please try again later.')
      }
      throw new Error(`Failed to fetch companies (HTTP ${response.status})`)
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
    // Re-throw if it's already our formatted error
    if (error instanceof Error && error.message.includes('Server error')) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.')
    }

    console.error('Error searching companies:', error)
    throw new Error(`Failed to search companies. ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      if (response.status === 404) {
        throw new Error(`Company with ticker "${ticker.toUpperCase()}" not found (404). Please verify the ticker symbol.`)
      }
      if (response.status >= 500) {
        throw new Error(`Server error (${response.status}). Please try again later.`)
      }
      throw new Error(`Failed to fetch data for ${ticker} (HTTP ${response.status})`)
    }

    const data: CompanyData = await response.json()
    return data
  } catch (error) {
    // Re-throw if it's already our formatted error
    if (error instanceof Error && (error.message.includes('404') || error.message.includes('Server error'))) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.')
    }

    console.error(`Error fetching company data for ${ticker}:`, error)
    throw new Error(`Failed to load company data. ${error instanceof Error ? error.message : 'Unknown error'}`)
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
