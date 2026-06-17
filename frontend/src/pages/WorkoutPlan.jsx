import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { API_URL } from '../aws-exports'

const clean = (s) => s?.replace(/\*\*/g, '').replace(/\*/g, '').trim() ?? ''

const DAY_PATTERN = /^(day\s*\d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i

const parsePlan = (text) => {
  if (!text) return { days: [], motivation: '' }
  const lines = text.split('\n').map(l => l.trim())
  const days = []
  let day = null, block = null, exercise = null
  let motivation = '', inMotivation = false

  const commitExercise = () => { if (exercise && block) { block.exercises.push(exercise); exercise = null } }
  const commitBlock = () => { commitExercise(); if (block && day) { day.blocks.push(block); block = null } }
  const commitDay = () => { commitBlock(); if (day) { days.push(day); day = null } }

  for (const line of lines) {
    if (!line || line === '---' || /^[|\-]{3,}$/.test(line)) continue

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = clean(headingMatch[2])

      inMotivation = /motivat/i.test(title)

      if (DAY_PATTERN.test(title)) {
        inMotivation = false
        commitDay()
        day = { title, meta: [], blocks: [] }
        block = null; exercise = null
      } else if (level >= 3 && day) {
        inMotivation = false
        commitBlock()
        block = { title, exercises: [] }
      }
      continue
    }

    if (inMotivation) {
      motivation += (motivation ? ' ' : '') + clean(line)
      continue
    }

    const numbered = line.match(/^(\d+)\.\s+(.+)$/)
    if (numbered && day) {
      if (!block) {
        block = { title: '', exercises: [] }
        day.blocks.push(block)
      }
      commitExercise()
      exercise = { num: numbered[1], name: clean(numbered[2]), detailLine: null, note: null }
      continue
    }

    if (/^(\*?(form\s*note|form\s*tip|coaching\s*note|note|tip))/i.test(line) && exercise) {
      exercise.note = clean(line.replace(/^\*?(form\s*notes?|form\s*tip|coaching\s*note|note|tip)\*?:?\s*/i, ''))
      continue
    }

    if ((/sets?[\s:|]/i.test(line) || /reps?[\s:|]/i.test(line)) && exercise) {
      exercise.detailLine = clean(line)
      continue
    }

    const kv = line.match(/^([A-Za-z][^:#|]{1,28}):\s+(.+)$/)
    if (kv && day && day.blocks.length === 0 && !block) {
      day.meta.push({ key: clean(kv[1]), value: clean(kv[2]) })
      continue
    }

    // Catch-all: any remaining text within a workout context gets attached as a note
    const text = clean(line)
    if (text && day) {
      if (exercise) {
        if (!exercise.note) exercise.note = text
      } else if (block) {
        if (!block.note) block.note = text
      }
    }
  }

  commitDay()
  return { days, motivation }
}

const parseChips = (detail) => {
  if (!detail) return []
  const chips = []
  const sets = detail.match(/sets?[\s:]+(\d+)/i) || detail.match(/^(\d+)\s*[x×]/i)
  const reps = detail.match(/reps?[\s:]+([0-9\-–]+)/i) || detail.match(/[x×]\s*([0-9\-–]+)/i)
  const rest = detail.match(/rest[\s:]+([^|,\n]+)/i)
  if (sets) chips.push({ label: sets[1] + ' sets', color: 'cyan' })
  if (reps) chips.push({ label: reps[1] + ' reps', color: 'violet' })
  if (rest) chips.push({ label: rest[1].trim().replace(/minutes?/i, 'min').replace(/seconds?/i, 's'), color: 'amber' })
  return chips
}

export default function WorkoutPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, signOut } = useAuthenticator((ctx) => [ctx.user])
  const navigate = useNavigate()

  useEffect(() => { fetchPlan() }, [])

  const fetchPlan = async () => {
    setLoading(true)
    setError('')
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()
      const res = await fetch(`${API_URL}/plan`, { headers: { Authorization: token } })
      if (res.status === 404) { setPlan(null); return }
      if (!res.ok) throw new Error('Failed to load workout plan')
      const data = await res.json()
      setPlan(data.workout_plan)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mb-4" />
          <p className="text-gray-500 text-sm tracking-wide">Loading your plan...</p>
        </div>
      </div>
    )
  }

  if (!plan && !error) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Plan Yet</h2>
          <p className="text-gray-500 text-sm mb-6">Fill out the questionnaire to get your AI-generated plan.</p>
          <button onClick={() => navigate('/questionnaire')}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-xl transition-colors">
            Create My Plan
          </button>
        </div>
      </div>
    )
  }

  const { days, motivation } = parsePlan(plan)

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">PeakCore AI</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/questionnaire')}
              className="text-xs text-gray-500 hover:text-white transition-colors border border-[#222] hover:border-[#333] px-3 py-1.5 rounded-lg">
              Regenerate
            </button>
            <button onClick={signOut} className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1.5">
              Sign out
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI Generated
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Your Workout <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Plan</span>
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Motivational message */}
        {motivation && (
          <div className="mb-5 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/15 rounded-2xl px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-500 mb-2">Your Coach Says</p>
            <p className="text-gray-300 text-sm leading-relaxed">{motivation}</p>
          </div>
        )}

        {/* Days */}
        <div className="space-y-3">
          {days.length > 0 ? days.map((day, i) => (
            <DayCard key={i} day={day} index={i} />
          )) : (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
              <pre className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {plan.replace(/^#{1,6}\s+/gm, '').replace(/\*\*/g, '').replace(/\*/g, '')}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button onClick={fetchPlan} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            Refresh plan
          </button>
        </div>

      </div>
    </div>
  )
}

const DAY_ACCENTS = [
  { border: 'border-l-cyan-500', badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { border: 'border-l-violet-500', badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  { border: 'border-l-amber-500', badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { border: 'border-l-emerald-500', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { border: 'border-l-rose-500', badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { border: 'border-l-blue-500', badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { border: 'border-l-orange-500', badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
]

function DayCard({ day, index }) {
  const [open, setOpen] = useState(index < 2)
  const accent = DAY_ACCENTS[index % DAY_ACCENTS.length]

  const dayLabel = day.title.match(/^(day\s*\d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)?.[0] ?? ''
  const subtitle = day.title.replace(/^(day\s*\d+[:\-–]?\s*|monday|tuesday|wednesday|thursday|friday|saturday|sunday[:\-–]?\s*)/i, '').trim()

  return (
    <div className={`bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden border-l-2 ${accent.border}`}>
      <button onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.015] transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          {dayLabel && (
            <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-md flex-shrink-0 ${accent.badge}`}>
              {dayLabel}
            </span>
          )}
          {subtitle && <span className="text-white text-sm font-semibold truncate">{subtitle}</span>}
          {!dayLabel && !subtitle && <span className="text-white text-sm font-semibold">{day.title}</span>}
        </div>
        <svg className={`w-4 h-4 text-gray-600 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-[#1a1a1a]">
          {day.meta.length > 0 && (
            <div className="px-5 py-3 flex flex-wrap gap-3 border-b border-[#161616]">
              {day.meta.map((m, i) => (
                <div key={i} className="text-xs">
                  <span className="text-gray-600">{m.key}: </span>
                  <span className="text-gray-300">{m.value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-4 space-y-5">
            {day.blocks.map((block, i) => (
              <WorkoutBlock key={i} block={block} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WorkoutBlock({ block }) {
  return (
    <div>
      {block.title && <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">{block.title}</p>}
      {block.note && <p className="text-gray-400 text-xs italic mb-3 leading-relaxed">{block.note}</p>}
      <div className="space-y-2">
        {block.exercises.map((ex, i) => (
          <ExerciseCard key={i} exercise={ex} />
        ))}
      </div>
    </div>
  )
}

function ExerciseCard({ exercise }) {
  const chips = parseChips(exercise.detailLine)

  return (
    <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-mono text-gray-600 pt-0.5 w-5 flex-shrink-0">{exercise.num}.</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-snug">{exercise.name}</p>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chips.map((chip, i) => (
                <Chip key={i} label={chip.label} color={chip.color} />
              ))}
            </div>
          )}
          {exercise.note && (
            <p className="text-[12px] text-gray-500 italic mt-2 leading-relaxed">{exercise.note}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const CHIP_STYLES = {
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  gray: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
}

function Chip({ label, color }) {
  return (
    <span className={`text-[11px] font-semibold border px-2 py-0.5 rounded-full ${CHIP_STYLES[color] ?? CHIP_STYLES.gray}`}>
      {label}
    </span>
  )
}
