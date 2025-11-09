import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CompanyAnalysis from './pages/CompanyAnalysis'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:ticker" element={<CompanyAnalysis />} />
      </Routes>
    </Router>
  )
}

export default App
