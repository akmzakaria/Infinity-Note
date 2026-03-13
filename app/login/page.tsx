'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/ToastProvider'
import Logo from '@/components/Logo'

// Prevent this page from being prerendered during build
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGuestAccess = () => {
    // Navigate to All category page for offline notes
    router.push('/?category=All')
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      showToast({
        variant: 'success',
        title: 'Welcome!',
        description: 'Successfully signed in with Google.',
      })
      router.push('/?category=All')
    } catch (error) {
      console.error('Sign in error:', error)
      showToast({
        variant: 'error',
        title: 'Sign in failed',
        description: 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur p-8 shadow-xl shadow-black/40 ring-1 ring-slate-800/70">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h1 className="text-3xl font-bold text-slate-50 mb-2">Welcome Back</h1>
          <p className="text-slate-400 mb-8">Sign in to access your notes</p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 mb-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <button
            onClick={handleGuestAccess}
            disabled={loading}
            className="w-full rounded-md border border-slate-600 bg-transparent px-6 py-3 text-base font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  )
}
