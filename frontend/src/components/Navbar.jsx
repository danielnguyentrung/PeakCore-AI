import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchUserAttributes } from 'aws-amplify/auth'

const links = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'FAQ', path: '/faq' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuthenticator((context) => [context.user])

  const email = user?.signInDetails?.loginId || ''
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!user) return
    fetchUserAttributes()
      .then(attrs => {
        const name = attrs.given_name || email.split('@')[0].split('.')[0]
        setDisplayName(name.charAt(0).toUpperCase() + name.slice(1))
      })
      .catch(() => {
        const fallback = email.split('@')[0].split('.')[0]
        setDisplayName(fallback.charAt(0).toUpperCase() + fallback.slice(1))
      })
  }, [user, email])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1e1e1e]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-base">
            Peak<span className="text-cyan-500">Core</span> AI
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA / User menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/questionnaire')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
                Regenerate Plan
              </button>
            <div className="relative" ref={dropdownRef} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#1e1e1e] hover:border-cyan-500/50 transition-all group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                  {displayName[0]?.toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                  Hello, {displayName}
                </span>
                <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#141414] border border-[#1e1e1e] rounded-xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1e1e1e]">
                    <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                    <p className="text-gray-500 text-xs truncate">{email}</p>
                  </div>
                  <div className="py-1">
                    <DropdownItem icon="⚡" label="My Workout Plan" onClick={() => { navigate('/workout'); setDropdownOpen(false) }} />
                    <DropdownItem icon="📋" label="Questionnaire" onClick={() => { navigate('/questionnaire'); setDropdownOpen(false) }} />
                  </div>
                  <div className="border-t border-[#1e1e1e] py-1">
                    <DropdownItem icon="🚪" label="Sign Out" onClick={() => { signOut(); navigate('/login') }} danger />
                  </div>
                </div>
              )}
            </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-2">
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 space-y-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false) }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#1e1e1e] flex flex-col gap-2">
            {user ? (
              <>
                <button onClick={() => { navigate('/workout'); setMenuOpen(false) }}
                  className="w-full py-2.5 border border-[#1e1e1e] text-gray-400 rounded-xl text-sm font-medium hover:border-gray-500 hover:text-white transition-all">
                  My Workout Plan
                </button>
                <button onClick={() => { signOut(); navigate('/login') }}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-2.5 border border-[#1e1e1e] text-gray-400 rounded-xl text-sm font-medium hover:border-gray-500 hover:text-white transition-all">
                  Sign In
                </button>
                <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
        danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
      }`}>
      <span>{icon}</span>
      {label}
    </button>
  )
}
