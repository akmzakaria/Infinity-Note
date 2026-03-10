import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'Infinity Note',
  description: 'A modern note-taking application',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon_transparent.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/favicon_transparent.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
}

export const viewport = {
  themeColor: '#1D4ED8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
