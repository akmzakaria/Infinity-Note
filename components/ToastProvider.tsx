'use client'

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (options: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = Date.now()
    const toast: Toast = { id, ...options }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[10000] flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
        {toasts.map((toast) => {
          const colorMap: Record<ToastVariant, string> = {
            success: 'border-emerald-400 bg-emerald-950/80 text-emerald-50',
            error: 'border-red-400 bg-red-950/80 text-red-50',
            info: 'border-sky-400 bg-sky-950/80 text-sky-50',
            warning: 'border-amber-400 bg-amber-950/80 text-amber-50',
          }
          return (
            <div
              key={toast.id}
              className={[
                'pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg shadow-black/40 backdrop-blur',
                colorMap[toast.variant],
              ].join(' ')}
            >
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-xs text-white/80">{toast.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
