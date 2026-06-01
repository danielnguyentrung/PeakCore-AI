import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Questionnaire from './pages/Questionnaire'
import WorkoutPlan from './pages/WorkoutPlan'
import HowItWorks from './pages/HowItWorks'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import About from './pages/About'

function ProtectedRoute({ children }) {
  const { user } = useAuthenticator((context) => [context.user])
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/workout" element={<WorkoutPlan />} />
    </Routes>
  )
}
