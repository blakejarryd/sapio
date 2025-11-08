import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import MetricDetail from './pages/MetricDetail'
import CompanyComparison from './pages/CompanyComparison'
import IndustryExplorer from './pages/IndustryExplorer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:ticker" element={<Dashboard />} />
        <Route path="/company/:ticker/metric/:metricKey" element={<MetricDetail />} />
        <Route path="/compare/:ticker" element={<CompanyComparison />} />
        <Route path="/industries" element={<IndustryExplorer />} />
      </Routes>
    </Router>
  )
}

export default App
