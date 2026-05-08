'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const allowed = process.env.NEXT_PUBLIC_ALLOWED_EMAIL
    if (allowed && email !== allowed) {
      setError('此 email 無權限登入')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-zinc-800">Magic link 已寄出</p>
          <p className="text-sm text-zinc-500">請檢查 {email} 的收件匣</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl p-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">brain-mirror</h1>
          <p className="text-sm text-zinc-500 mt-1">輸入 email 取得登入連結</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '傳送中...' : '寄出 Magic Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
