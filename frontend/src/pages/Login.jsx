import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'

export default function Login() {
  const { user } = useAuthenticator((context) => [context.user])
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/questionnaire')
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-400 mb-5 shadow-lg shadow-cyan-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            PeakCore <span className="text-cyan-500">AI</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Your AI-powered personal trainer
          </p>
        </div>

        {/* Amplify Auth component */}
        <Authenticator
          loginMechanisms={['email']}
          signUpAttributes={['email']}
        />

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By signing in you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
