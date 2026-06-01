import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const steps = [
  {
    number: '01',
    icon: '📋',
    title: 'Tell Us About Yourself',
    desc: 'Fill out a quick 5-step questionnaire covering your fitness goals, experience level, available equipment, lifestyle, and any injuries. Takes less than 5 minutes.',
    details: ['Age, weight, height', 'Fitness goals & experience', 'Work schedule & lifestyle', 'Available gym equipment', 'Injuries or limitations'],
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI Builds Your Plan',
    desc: 'Our AI model powered by AWS Bedrock analyzes your profile and generates a fully personalized workout plan tailored specifically to you.',
    details: ['Powered by Claude AI via AWS Bedrock', 'Considers all your profile data', 'Accounts for recovery and lifestyle', 'Adapts to your equipment', 'Generates in minutes'],
  },
  {
    number: '03',
    icon: '📧',
    title: 'Receive Your Plan',
    desc: 'Your personalized workout plan is sent directly to your email and saved to your account. View it anytime from the app.',
    details: ['Emailed to your inbox instantly', 'Saved to your profile', 'Accessible anytime in the app', 'Full weekly schedule with sets & reps', 'Form notes for key exercises'],
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">Simple Process</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Works</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From zero to a personalized AI workout plan in under 5 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-8 top-full w-px h-6 bg-gradient-to-b from-cyan-500/30 to-transparent" />
              )}

              <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 hover:border-cyan-500/20 transition-all group">
                <div className="flex flex-col sm:flex-row gap-6">

                  {/* Step number + icon */}
                  <div className="flex-shrink-0 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/20 border border-cyan-500/20 flex items-center justify-center text-2xl group-hover:border-cyan-500/40 transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-cyan-500 font-black text-sm">{step.number}</span>
                      <h3 className="text-white font-bold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-4">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((d, j) => (
                        <span key={j} className="text-xs text-gray-500 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-3 py-1">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture note */}
        <div className="mt-12 bg-gradient-to-br from-cyan-500/5 to-cyan-400/5 border border-cyan-500/10 rounded-2xl p-6 sm:p-8">
          <h3 className="text-white font-bold text-lg mb-4">Built on AWS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['AWS Cognito', 'API Gateway', 'AWS Lambda', 'Amazon SQS', 'AWS Bedrock', 'DynamoDB', 'Amazon SES', 'CloudFront'].map(service => (
              <div key={service} className="bg-[#141414] border border-[#1e1e1e] rounded-xl px-3 py-2 text-center">
                <p className="text-gray-300 text-xs font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-cyan-500/20 text-base">
            Get My Free Plan
          </button>
        </div>
      </div>
    </div>
  )
}
