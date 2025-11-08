# Sapio - Simple Stock Investing

A mobile-first web application that demystifies stock investing for everyday people. Built with simplicity, polish, and education as core principles.

## Mission

Demystify stock investing for the everyday person by providing a clean, simple interface focused on 6 key metrics instead of overwhelming data density.

## Tech Stack

- **Frontend Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS (mobile-first)
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## Features

### Core User Flow

1. **Home Screen:** Single, centered search bar
2. **Search:** Search for any listed company (e.g., "Tesla" or "TSLA")
3. **Animation:** Search bar smoothly animates to top header
4. **Dashboard:** 6 key metric tiles displayed below
5. **Detail View:** Tap any tile to see:
   - Simple explanation of the metric
   - Company's specific data
   - 5-year historical chart

### The 6 Key Metrics

1. **Company Value** (Market Cap)
2. **Total Sales** (Revenue)
3. **Sales Growth** (YoY %)
4. **Profit** (Net Income)
5. **Profit Margin** (%)
6. **Total Debt**

## Project Structure

```
sapio/
├── public/
│   └── api/                    # Mock API JSON files
│       ├── companies.json      # Company index
│       └── companies/          # Individual company data
├── src/
│   ├── components/            # React components
│   │   ├── SearchBar.tsx     # Animated search
│   │   ├── MetricTile.tsx    # Individual metric card
│   │   ├── MetricGrid.tsx    # 2x3 grid layout
│   │   └── MetricChart.tsx   # Historical chart
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── Dashboard.tsx     # Company metrics view
│   │   └── MetricDetail.tsx  # Single metric detail
│   ├── services/             # API services
│   │   └── api.ts            # Mock API client
│   ├── types/                # TypeScript types
│   │   └── company.ts        # Data interfaces
│   ├── utils/                # Utility functions
│   │   └── formatters.ts     # Number/currency formatting
│   └── App.tsx               # Main app with routing
```

## Mock API

The app currently uses local JSON files as a mock API to enable frontend development without backend dependencies.

### Available Companies

- **TSLA** - Tesla, Inc.
- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **AMZN** - Amazon.com, Inc.

### API Endpoints

- `GET /api/companies.json` - List all companies
- `GET /api/companies/{TICKER}.json` - Get company data

The mock API includes a 500ms simulated latency for realistic UX testing.

## Design Principles

1. **Simplicity Over Features** - Reject complexity, embrace minimalism
2. **Design-Led** - User experience is paramount
3. **Mobile-First** - Designed for phones from the ground up
4. **Educational** - Help users understand, not just show data

## Future Enhancements

- Real financial data API integration
- More companies and global exchanges
- User accounts and watchlists
- Additional educational content
- PWA capabilities
- Dark mode

## Development

### Running Tests

```bash
npm test          # Run tests once
npm run test:ui   # Run tests with UI
```

### Building

```bash
npm run build     # Build for production
npm run preview   # Preview production build
```

## License

Private - All rights reserved
