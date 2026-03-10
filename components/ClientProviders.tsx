'use client'

import { ReactNode } from 'react'
import { ToastProvider } from './ToastProvider'
import { AuthProvider } from './AuthProvider'
import ServiceWorkerRegister from './ServiceWorkerRegister'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ServiceWorkerRegister />
        {children}
      </AuthProvider>
    </ToastProvider>
  )
}
