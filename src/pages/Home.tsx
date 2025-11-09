import SearchBar from '../components/SearchBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        {/* Logo/Branding */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 mb-3 tracking-tight">
            Sapio
          </h1>
          <p className="text-lg text-slate-600">
            Understand companies through profitability and business fundamentals
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Footer hint */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Search for companies like{' '}
            <span className="text-slate-700 font-medium">Tesla</span>,{' '}
            <span className="text-slate-700 font-medium">Apple</span>,{' '}
            <span className="text-slate-700 font-medium">Microsoft</span>,{' '}
            <span className="text-slate-700 font-medium">Google</span>, or{' '}
            <span className="text-slate-700 font-medium">Amazon</span>
          </p>
        </div>
      </div>
    </div>
  )
}
