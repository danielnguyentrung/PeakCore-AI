import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  'Fully personalized AI workout plan',
  'All 18-point fitness profile',
  'Weekly workout schedule with sets & reps',
  'Form notes for all exercises',
  'Equipment-based customization',
  'Injury & limitation awareness',
  'Email delivery of your plan',
  'Access your plan anytime in-app',
  'Goal-focused programming',
  'Lifestyle & recovery consideration',
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">Beta Access | Free</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            PeakCore AI is currently in beta. Everything is free while we build and improve the product.
          </p>
        </div>

        {/* Pricing card */}
        <div className="max-w-md mx-auto">
          <div className="relative bg-[#141414] border border-cyan-500/30 rounded-3xl p-8 overflow-hidden">

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-400/5 pointer-events-none" />

            {/* Beta badge */}
            <div className="absolute top-5 right-5">
              <span className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                BETA
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium mb-2">Beta Access</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-6xl font-extrabold text-white">$0</span>
                <span className="text-gray-500 mb-3">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">
                Free during beta testing. Pricing will be announced before full launch.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-cyan-500/20 text-base mb-8">
                Get Started Free
              </button>

              {/* Features list */}
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Beta note */}
        <div className="mt-10 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 text-center max-w-md mx-auto">
          <p className="text-2xl mb-3">🚀</p>
          <h3 className="text-white font-bold mb-2">Beta Testers Get Locked-In Pricing</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Users who join during beta will receive preferential pricing when we launch. Sign up now to lock in your spot.
          </p>
        </div>

      </div>
    </div>
  )
}
