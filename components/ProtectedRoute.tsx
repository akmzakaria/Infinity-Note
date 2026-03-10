'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div
        className="flex flex-1 min-h-dvh items-center justify-center p-12"
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
