import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What is PeakCore AI?',
        a: 'PeakCore AI is an AI-powered workout plan generator. You fill out a detailed fitness questionnaire and our AI builds you a fully personalized weekly workout plan based on your goals, experience, equipment, and lifestyle.',
      },
      {
        q: 'How is this different from other fitness apps?',
        a: 'Most fitness apps give you generic plans. PeakCore AI uses your specific profile including your job demands, injuries, available equipment, and goals to generate a plan that is built entirely around you, not a template.',
      },
      {
        q: 'Is PeakCore AI free?',
        a: 'Yes! PeakCore AI is completely free during our beta period. Users who join beta will receive preferential pricing when we launch our full product.',
      },
    ],
  },
  {
    category: 'Your Workout Plan',
    items: [
      {
        q: 'How long does it take to generate my plan?',
        a: 'Your plan is generated within a few minutes. You\'ll receive an email notification when it\'s ready, then you can view it anytime in the app.',
      },
      {
        q: 'Can I regenerate my plan?',
        a: 'Yes! If your goals change or you want a fresh plan, you can go back to the questionnaire, update your answers, and generate a new plan at any time.',
      },
      {
        q: 'Does the plan include form guidance?',
        a: 'Yes. Your plan includes brief form notes for key exercises to help you perform movements safely and effectively.',
      },
      {
        q: 'What if I don\'t have gym equipment?',
        a: 'No problem. You can select "Bodyweight Only" and your plan will be built entirely around exercises that require no equipment at all.',
      },
    ],
  },
  {
    category: 'Account & Data',
    items: [
      {
        q: 'How do I sign in?',
        a: 'PeakCore AI uses Amazon Cognito for secure authentication. You sign up and log in with your email address. Your data is securely stored in AWS.',
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. Your data is stored securely in AWS DynamoDB and all requests are authenticated via JWT tokens. We never share your personal data with third parties.',
      },
      {
        q: 'Can I update my profile information?',
        a: 'Yes. You can go back to the questionnaire at any time to update your profile and regenerate your plan based on your new information.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What AI model powers PeakCore AI?',
        a: 'PeakCore AI uses Claude, the AI model from Anthropic, accessed via AWS Bedrock. Claude is one of the most capable AI models available for understanding complex, nuanced requests like personalized fitness planning.',
      },
      {
        q: 'What AWS services does PeakCore AI use?',
        a: 'PeakCore AI is built on a fully serverless AWS architecture including: Cognito (auth), API Gateway, Lambda, SQS, Bedrock, DynamoDB, SES, S3, and CloudFront.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-[#1e1e1e] bg-[#141414]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4">
        <span className={`font-medium text-sm transition-colors ${open ? 'text-cyan-400' : 'text-white'}`}>{q}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180 text-cyan-400' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">Got Questions?</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Everything you need to know about PeakCore AI.
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {faqs.map((section, i) => (
            <div key={i}>
              <h2 className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 text-center bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8">
          <p className="text-2xl mb-3">💬</p>
          <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-6">
            Reach out and we'll get back to you as soon as possible.
          </p>
          <a href="mailto:support@peakcoreai.com"
            className="px-6 py-3 border border-[#1e1e1e] text-gray-400 rounded-xl text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all inline-block">
            support@peakcoreai.com
          </a>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-cyan-500/20">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  )
}
