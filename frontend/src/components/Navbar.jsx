import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const links = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'FAQ', path: '/faq' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
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
            <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
              className="w-full py-2.5 border border-[#1e1e1e] text-gray-400 rounded-xl text-sm font-medium hover:border-gray-500 hover:text-white transition-all">
              Sign In
            </button>
            <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
