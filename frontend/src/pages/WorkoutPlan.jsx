import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { API_URL } from '../aws-exports'

export default function WorkoutPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const navigate = useNavigate()

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    setLoading(true)
    setError('')
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()

      const res = await fetch(`${API_URL}/plan`, {
        headers: { 'Authorization': token },
      })

      if (res.status === 404) {
        setPlan(null)
        return
      }

      if (!res.ok) throw new Error('Failed to load workout plan')

      const data = await res.json()
      setPlan(data.workout_plan)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Parse the workout plan text into day sections
  const parsePlan = (text) => {
    if (!text) return []
    const lines = text.split('\n').filter(l => l.trim())
    const sections = []
    let current = null

    for (const line of lines) {
      const isDayHeader = /^(day\s*\d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(line.trim())

      if (isDayHeader) {
        if (current) sections.push(current)
        current = { title: line.trim(), content: [] }
      } else if (current) {
        current.content.push(line.trim())
      } else {
        if (!sections.length) sections.push({ title: 'Overview', content: [] })
        sections[0].content.push(line.trim())
      }
    }

    if (current) sections.push(current)
    return sections
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading your workout plan...</p>
        </div>
      </div>
    )
  }

  if (!plan && !error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#141414] border border-[#1e1e1e] mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Plan Yet</h2>
          <p className="text-gray-400 mb-8 text-sm">
            You haven't generated a workout plan yet. Fill out the questionnaire to get your personalized AI plan.
          </p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
            Create My Plan
          </button>
        </div>
      </div>
    )
  }

  const sections = parsePlan(plan)

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">PeakCore AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/questionnaire')}
              className="text-xs text-gray-500 hover:text-cyan-400 transition-colors border border-[#1e1e1e] hover:border-cyan-500/50 px-3 py-1.5 rounded-lg">
              Regenerate
            </button>
            <button onClick={signOut} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Sign out
            </button>
          </div>
        </div>

        {/* Hero section */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 border border-cyan-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">AI Generated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Workout Plan</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Personalized for {user?.signInDetails?.loginId}
          </p>

          <div className="flex gap-4 mt-4">
            <Stat icon="🔥" label="Personalized" />
            <Stat icon="⚡" label="AI Powered" />
            <Stat icon="🎯" label="Goal Focused" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
            <p className="text-cyan-300 text-sm">{error}</p>
          </div>
        )}

        {/* Plan sections */}
        {sections.length > 0 ? (
          <div className="space-y-4">
            {sections.map((section, i) => (
              <DayCard key={i} section={section} index={i} />
            ))}
          </div>
        ) : (
          // Fallback — display raw text if parsing finds no day sections
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {plan}
            </pre>
          </div>
        )}

        {/* Refresh button */}
        <div className="mt-8 text-center">
          <button onClick={fetchPlan}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors flex items-center gap-2 mx-auto">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh plan
          </button>
        </div>

      </div>
    </div>
  )
}

function DayCard({ section, index }) {
  const [open, setOpen] = useState(index < 3)

  const dayColors = [
    'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    'from-cyan-400/20 to-cyan-400/5 border-cyan-400/30 text-cyan-300',
    'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    'from-cyan-600/20 to-cyan-600/5 border-cyan-600/30 text-cyan-500',
    'from-cyan-600/20 to-cyan-600/5 border-cyan-600/30 text-cyan-400',
    'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
    'from-cyan-400/20 to-cyan-400/5 border-cyan-400/30 text-cyan-300',
  ]

  const colorClass = dayColors[index % dayColors.length]

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full p-5 flex items-center justify-between bg-gradient-to-r ${colorClass} border-b border-[#1e1e1e] transition-all`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">
            {section.title.match(/day\s*\d+/i) ? section.title.match(/day\s*\d+/i)[0] : `#${index + 1}`}
          </span>
          <h3 className="font-bold text-white text-sm sm:text-base">
            {section.title.replace(/^day\s*\d+[:\-–]?\s*/i, '').trim() || section.title}
          </h3>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-5">
          <div className="space-y-2">
            {section.content.map((line, i) => (
              <PlanLine key={i} line={line} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlanLine({ line }) {
  const isExercise = /^\d+[\.\)]|^[-•*]|sets|reps|rest/i.test(line)
  const isHeader = /^[A-Z][A-Z\s]+:?$/.test(line) || line.endsWith(':')

  if (isHeader) {
    return <p className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mt-4 mb-2">{line}</p>
  }

  if (isExercise) {
    return (
      <div className="flex gap-3 py-2 border-b border-[#1e1e1e] last:border-0">
        <span className="text-cyan-500 mt-0.5 flex-shrink-0">▸</span>
        <p className="text-gray-300 text-sm leading-relaxed">{line}</p>
      </div>
    )
  }

  return <p className="text-gray-400 text-sm leading-relaxed">{line}</p>
}

function Stat({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-gray-400 text-xs">{label}</span>
    </div>
  )
}
