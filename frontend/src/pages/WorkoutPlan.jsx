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
  let inProgramNotes = false, programNotes = [], currentNote = null
  let tableHeaders = null

  const commitExercise = () => { if (exercise && block) { block.exercises.push(exercise); exercise = null } }
  const commitBlock = () => { commitExercise(); if (block && day) { day.blocks.push(block); block = null } }
  const commitDay = () => { commitBlock(); if (day) { days.push(day); day = null } }

  for (const line of lines) {
    if (!line || line === '---' || /^[|\-]{3,}$/.test(line)) continue

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = clean(headingMatch[2])
      tableHeaders = null

      inMotivation = /motivat/i.test(title)
      inProgramNotes = /program\s*notes?|progression/i.test(title)

      if (DAY_PATTERN.test(title)) {
        inMotivation = false
        inProgramNotes = false
        currentNote = null
        commitDay()
        day = { title, meta: [], blocks: [] }
        block = null; exercise = null
      } else if (inProgramNotes) {
        currentNote = null
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

    if (inProgramNotes) {
      const boldHeader = line.match(/^\*\*(.+?)\*\*:?\s*$/)
      if (boldHeader) {
        currentNote = { title: clean(boldHeader[1]).replace(/:$/, ''), bullets: [] }
        programNotes.push(currentNote)
        continue
      }
      const bullet = line.match(/^[-*]\s+(.+)$/)
      if (bullet && currentNote) {
        currentNote.bullets.push(clean(bullet[1]))
      }
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

    // Table header row — capture column order
    if (line.startsWith('|') && /exercise|movement|sets?|reps?|rest/i.test(line)) {
      tableHeaders = line.split('|').map(c => clean(c).toLowerCase()).filter(Boolean)
      continue
    }

    // Table data row — exercises in table format
    if (line.startsWith('|') && day && !inProgramNotes) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cells.length && !/^[-:]+$/.test(cells[0])) {
        const name = clean(cells[0])
        if (name) {
          if (!block) block = { title: '', exercises: [] }
          commitExercise()
          const colLabels = tableHeaders ? tableHeaders.slice(1) : ['sets', 'reps', 'rest']
          const parts = cells.slice(1).map((val, i) => {
            if (!val || val === '-' || val === '—') return null
            const hdr = colLabels[i] || ''
            if (/sets?/i.test(hdr)) return `Sets: ${val}`
            if (/reps?/i.test(hdr)) return `Reps: ${val}`
            if (/rest/i.test(hdr)) return `Rest: ${val}`
            return null
          }).filter(Boolean)
          exercise = { num: String(block.exercises.length + 1), name, detailLine: parts.join(' | ') || null, note: null }
          commitExercise()
        }
      }
      continue
    }

    // Bullet points (rest days, recommendation sections)
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (bullet && day && !exercise) {
      if (!day.notes) day.notes = []
      day.notes.push(clean(bullet[1]))
      continue
    }

    // Catch-all: any remaining text within a workout context gets attached as a note
    const text = clean(line)
    if (text && day) {
      if (exercise) {
        if (!exercise.note) exercise.note = text
      } else if (block) {
        if (!block.note) block.note = text
      } else if (!line.startsWith('|')) {
        if (!day.notes) day.notes = []
        day.notes.push(text)
      }
    }
  }

  commitDay()
  return { days, motivation, programNotes }
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
  const { signOut } = useAuthenticator((ctx) => [ctx.user])
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

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">No Workout Plan Yet</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            You haven't generated a plan yet. Complete the questionnaire and our AI will build a fully personalized workout plan based on your goals, fitness level, and schedule.
          </p>

          {/* Steps */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 mb-8 text-left space-y-4">
            {[
              { step: '1', label: 'Fill out the questionnaire', desc: 'Tell us about your goals, experience, and schedule' },
              { step: '2', label: 'AI generates your plan', desc: 'Claude builds a personalized weekly workout program' },
              { step: '3', label: 'Start training', desc: 'Follow your plan and track your progress' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs font-bold">{step}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/questionnaire')}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
            Get My Workout Plan
          </button>
          <button onClick={() => navigate('/')}
            className="mt-3 w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Back to Home
          </button>

        </div>
      </div>
    )
  }

  const { days, motivation, programNotes } = parsePlan(plan)

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
                {plan?.replace(/^#{1,6}\s+/gm, '').replace(/\*\*/g, '').replace(/\*/g, '')}
              </pre>
            </div>
          )}
        </div>

        {programNotes && programNotes.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Program Notes & Progression</p>
              <div className="flex-1 h-px bg-[#1a1a1a]" />
            </div>
            <div className="space-y-3">
              {programNotes.map((note, i) => {
                const isSignature = note.bullets.length === 0 && /^[-–]/.test(note.title)
                if (isSignature) return null
                const next = programNotes[i + 1]
                const signature = (next && next.bullets.length === 0 && /^[-–]/.test(next.title)) ? next.title : null
                return <NoteCard key={i} note={note} signature={signature} />
              })}
            </div>
          </div>
        )}

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
  const [open, setOpen] = useState(index === 0)
  const accent = DAY_ACCENTS[index % DAY_ACCENTS.length]

  const dayLabel = day.title.match(/^(day\s*\d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)?.[0] ?? ''
  const subtitle = day.title.replace(/^(day\s*\d+[:\-–]?\s*|monday|tuesday|wednesday|thursday|friday|saturday|sunday[:\-–]?\s*)/i, '').trim()

  const metaPreview = !open && day.meta.length > 0
    ? day.meta.filter(m => /duration|target|focus/i.test(m.key)).slice(0, 2)
    : []

  return (
    <div className={`bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden border-l-2 ${accent.border}`}>
      <button onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.015] transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {dayLabel && (
            <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-md flex-shrink-0 ${accent.badge}`}>
              {dayLabel}
            </span>
          )}
          <div className="min-w-0">
            {subtitle && <p className="text-white text-sm font-semibold truncate">{subtitle}</p>}
            {!dayLabel && !subtitle && <p className="text-white text-sm font-semibold">{day.title}</p>}
            {metaPreview.length > 0 && (
              <div className="flex gap-3 mt-0.5">
                {metaPreview.map((m, i) => (
                  <span key={i} className="text-[11px] text-gray-600">
                    {m.value}
                  </span>
                ))}
              </div>
            )}
          </div>
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
          {day.blocks.length > 0 && (
            <div className="px-5 py-4 space-y-5">
              {day.blocks.map((block, i) => (
                <WorkoutBlock key={i} block={block} />
              ))}
            </div>
          )}
          {day.notes && day.notes.length > 0 && (
            <div className="px-5 py-4 space-y-2">
              {day.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}
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

function NoteCard({ note, signature }) {
  const isQuote = note.bullets.length === 0

  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl px-5 py-4">
      {isQuote ? (
        <div>
          <p className="text-sm text-gray-300 leading-relaxed italic">{note.title}</p>
          {signature && (
            <p className="text-right text-xs text-cyan-400/70 font-medium mt-3 pt-3 border-t border-[#1e1e1e]">
              {signature}
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-500/80 mb-3">{note.title}</p>
          <ul className="space-y-2">
            {note.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {signature && (
            <p className="text-right text-xs text-cyan-400/70 font-medium mt-3 pt-3 border-t border-[#1e1e1e]">
              {signature}
            </p>
          )}
        </>
      )}
    </div>
  )
}
