import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'Infinity Note',
  description: 'A modern note-taking application',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/logo_thick.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/icon-192-thick.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
  other: {
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport = {
  themeColor: '#1D4ED8',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-50 antialiased" style={{ backgroundColor: '#0c1327' }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
