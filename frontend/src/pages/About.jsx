import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const stack = [
  { name: 'React + Vite', role: 'Frontend', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { name: 'Tailwind CSS', role: 'Styling', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { name: 'AWS Cognito', role: 'Authentication', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { name: 'API Gateway', role: 'API Layer', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { name: 'AWS Lambda', role: 'Serverless Functions', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  { name: 'Amazon SQS', role: 'Message Queue', color: 'text-cyan-300 bg-cyan-300/10 border-cyan-300/20' },
  { name: 'AWS Bedrock', role: 'AI Model (Claude)', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  { name: 'DynamoDB', role: 'Database', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { name: 'Amazon SES', role: 'Email Service', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  { name: 'S3 + CloudFront', role: 'Hosting & CDN', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  { name: 'Terraform', role: 'Infrastructure as Code', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  { name: 'Python', role: 'Backend Logic', color: 'text-blue-300 bg-blue-300/10 border-blue-300/20' },
]

const values = [
  { icon: '🎯', title: 'Truly Personalized', desc: 'No generic plans. Every workout is built around your specific goals, lifestyle, equipment, and limitations.' },
  { icon: '⚡', title: 'Fast & Simple', desc: 'A 5-minute questionnaire is all it takes. No complicated setups, no personal trainers required.' },
  { icon: '🔒', title: 'Secure by Design', desc: 'Built on AWS with enterprise-grade security. Your data is encrypted and never shared.' },
  { icon: '🚀', title: 'Always Improving', desc: 'As AI models improve, so do your workout plans. We continuously update to give you the best results.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">Our Story</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">PeakCore AI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            PeakCore AI was built out of a simple frustration. Most workout apps give you the same generic plan as everyone else.
            We believe your workout should be as unique as you are.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 border border-cyan-500/20 rounded-2xl p-8 mb-12">
          <h2 className="text-white font-bold text-2xl mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            To make <span className="text-cyan-400 font-semibold">truly personalized fitness</span> accessible to everyone, not just people who can afford a personal trainer.
            By combining AI with a deep understanding of fitness science, we give every user a plan that's built specifically for them.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 hover:border-cyan-500/20 transition-all">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Builder section */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 mb-12">
          <h2 className="text-white font-bold text-2xl mb-6">Built By</h2>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
              D
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Daniel Nguyen</h3>
              <p className="text-cyan-400 text-sm mb-4">Cloud Engineer & Builder</p>

              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  I hold a <span className="text-white font-medium">Bachelor of Business Technology Management</span> from{' '}
                  <span className="text-white font-medium">Toronto Metropolitan University</span>. I have spent the last 5 years working in IT,
                  starting as a Project Coordinator and moving into a Systems Administrator role.
                </p>
                <p>
                  Outside of tech, I am an <span className="text-white font-medium">active bodybuilder</span>. Juggling a full-time job,
                  training, commuting, and everyday responsibilities means finding time to research and build a proper workout plan
                  is always the first thing to go. I got tired of spending hours looking for something that actually fit{' '}
                  <span className="text-white font-medium">my goals, my schedule, and my equipment</span>.
                </p>
                <p>
                  I knew I was not alone. A lot of people with busy careers, active lifestyles, and real responsibilities
                  struggle to find a workout plan that is actually built for them and not just a generic template pulled from a
                  fitness blog. So I decided to build the solution myself.
                </p>
                <p>
                  In 2026 I taught myself <span className="text-white font-medium">Python and Terraform</span> from scratch,
                  earned my <span className="text-white font-medium">AWS Solutions Architect</span> certification, and built
                  PeakCore AI. It is a fully serverless AWS application that automates the entire process. Answer a few questions
                  and get a personalized plan built by AI in minutes.
                </p>
                <p>
                  PeakCore AI is both my portfolio project and a product I genuinely use and believe in.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  'AWS Solutions Architect',
                  'Security+',
                  'Network+',
                  'A+',
                  'Python',
                  'Terraform',
                  'Toronto Metropolitan University',
                ].map(tag => (
                  <span key={tag} className="text-xs text-gray-500 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <h2 className="text-white font-bold text-2xl mb-2">Tech Stack</h2>
          <p className="text-gray-500 text-sm mb-6">Built entirely on AWS with modern frontend tooling.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stack.map((t, i) => (
              <div key={i} className={`border rounded-xl px-4 py-3 ${t.color}`}>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs opacity-60 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-cyan-500/20 text-base">
            Try PeakCore AI Free
          </button>
        </div>

      </div>
    </div>
  )
}
