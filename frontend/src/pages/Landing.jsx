import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import Navbar from '../components/Navbar'

function GlitchText({ text, className }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    // Glitch on load after short delay
    const initial = setTimeout(() => triggerGlitch(), 600)
    // Then glitch randomly every few seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) triggerGlitch()
    }, 3000)
    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [])

  const triggerGlitch = () => {
    setGlitching(true)
    setTimeout(() => setGlitching(false), 600)
  }

  return (
    <span
      className={`${className} ${glitching ? 'glitch' : ''} cursor-pointer`}
      data-text={text}
      onClick={triggerGlitch}
    >
      {text}
    </span>
  )
}

export default function Landing() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthenticator((ctx) => [ctx.user])

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <Navbar />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-5" />

      {/* Content */}
      <div className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">AI Powered Training</span>
        </div>

        {/* Main heading */}
        <div className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-500 text-lg font-medium mb-2 tracking-wide">Welcome to</p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none mb-6 select-none">
            <GlitchText text="Peak" className="text-white glitch-white" />
            <GlitchText
              text="Core"
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 animate-gradient glitch-cyan"
            />
            <GlitchText text=" AI" className="text-white glitch-white" />
          </h1>
        </div>

        {/* Tagline */}
        <p className={`text-gray-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Your personalized AI-powered gym coach. Answer a few questions and get a
          <span className="text-white font-medium"> custom workout plan</span> built just for you.
        </p>

        {/* Stats row */}
        <div className={`flex flex-wrap items-center justify-center gap-6 mb-12 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Stat number="100%" label="Personalized" />
          <Divider />
          <Stat number="AI" label="Generated" />
          <Divider />
          <Stat number="5min" label="Setup Time" />
          <Divider />
          <Stat number="Free" label="To Use" />
        </div>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold rounded-2xl text-base hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95">
            <span className="relative z-10 flex items-center gap-2">
              Get Started Free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border border-[#1e1e1e] text-gray-400 font-medium rounded-2xl text-base hover:border-gray-500 hover:text-gray-200 transition-all">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Feature cards at the bottom */}
      <div className={`relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mt-20 transition-all duration-700 delay-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <FeatureCard
          icon="⚡"
          title="Instant Generation"
          desc="Your plan is built by AI in minutes, not days"
        />
        <FeatureCard
          icon="🎯"
          title="Goal Focused"
          desc="Tailored to your specific fitness goals and lifestyle"
        />
        <FeatureCard
          icon="🔄"
          title="Auto Refresh"
          desc="Plans that evolve as your fitness level improves"
        />
      </div>

    </div>
  )
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-white font-extrabold text-xl">{number}</p>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-8 bg-[#2a2a2a]" />
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 hover:border-cyan-500/30 hover:bg-[#1f1f1f] transition-all group">
      <span className="text-2xl mb-3 block">{icon}</span>
      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  )
}
