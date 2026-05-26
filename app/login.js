'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, Scissors } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const { login, user }             = useAuth()
  const router                      = useRouter()

  useEffect(() => { if (user) router.replace('/dashboard') }, [user, router])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Enter email and password'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.replace('/dashboard')
    } catch (err) {
      const msg = {
        'auth/user-not-found':   'No account found with this email',
        'auth/wrong-password':   'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }
      toast.error(msg[err.code] || 'Login failed. Check your connection.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-600/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-[slideUp_0.3s_ease-out]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 border border-gold-500/30 mb-4">
            <Scissors className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-3xl font-bold gold-text mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            SANKIRTHI DESIGNERS
          </h1>
          <p className="text-dark-400 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-xl text-dark-100 mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sign In to Continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com" className="input-dark pl-10" autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="block text-dark-300 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password" className="input-dark pl-10 pr-10"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3 mt-2 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-dark-500 text-xs mt-6">
            First time? Go to Firebase Console →<br />
            Authentication → Users → Add User
          </p>
        </div>

        <p className="text-center text-dark-700 text-xs mt-6">
          © 2025 Sankirthi Designers. All rights reserved.
        </p>
      </div>
    </div>
  )
}
