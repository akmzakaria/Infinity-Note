'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/ToastProvider'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Profile() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      showToast({
        variant: 'success',
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      showToast({
        variant: 'error',
        title: 'Sign out failed',
        description: 'Please try again.',
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 p-4 md:p-8">
        <div className="w-full max-w-[600px] rounded-xl bg-slate-900/80 backdrop-blur p-8 shadow-xl shadow-black/40 ring-1 ring-slate-800/70">
          <button
            className="mb-6 px-4 py-2 text-base text-sky-400 transition-colors hover:text-sky-300"
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1 className="mb-6 text-3xl font-semibold text-slate-50">Profile</h1>

          {user && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
