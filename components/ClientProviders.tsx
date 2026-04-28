'use client'

import { ReactNode } from 'react'
import { ToastProvider } from './ToastProvider'
import { AuthProvider } from './AuthProvider'
import ServiceWorkerRegister from './ServiceWorkerRegister'
import { NotesProvider } from './NotesProvider'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotesProvider>
          <ServiceWorkerRegister />
          {children}
        </NotesProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
