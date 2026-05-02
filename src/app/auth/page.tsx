'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email to confirm your account.')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[#00D4AA] font-bold text-2xl">GritMap</span>
          <h1 className="text-white font-bold text-2xl mt-2">
            {mode === 'login' ? 'Welcome back' : 'Join GritMap'}
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account to save events and host races'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setMessage(null) }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'login' ? 'bg-[#00D4AA] text-[#0A1628]' : 'text-white/60 hover:text-white'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-[#00D4AA] text-[#0A1628]' : 'text-white/60 hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {message && <p className="text-[#00D4AA] text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D4AA] text-[#0A1628] font-semibold py-3 rounded-xl hover:bg-[#00bfa0] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
