'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    if (!data.user) {
      setLoading(false)
      setError('Unable to sign in.')
      return
    }

    // Simple placeholder check: only allow emails ending with @molyph.com as admins.
    // Replace this with a proper role check (e.g. user_metadata.is_admin) once wired in Supabase.
    if (!data.user.email || !data.user.email.endsWith('@molyph.com')) {
      setLoading(false)
      setError('You do not have admin access to this panel.')
      await supabase.auth.signOut()
      return
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-slate-800 p-8 shadow-2xl shadow-black/40">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald-400 uppercase mb-2">
            Molyph
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Admin Console</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your admin credentials to manage vendors and onboardings.
          </p>
        </header>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Work email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@molyph.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </section>
    </main>
  )
}
