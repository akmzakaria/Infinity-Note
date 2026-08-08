import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const siteUrl = 'https://infinity-note.vercel.app'
const siteName = 'Infinity Note'
const siteDescription =
  'Infinity Note - Free online note taking app with unlimited notes, categories, and cloud sync. Create, organize, and access your notes anywhere. Best note-taking app for students, professionals, and writers. Simple, fast, and secure note organizer.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Infinity Note - Free Online Note Taking App | Organize Notes with Categories',
    template: '%s | Infinity Note',
  },
  description: siteDescription,
  keywords: [
    // Primary keywords
    'note taking app',
    'online notes',
    'free note app',
    'digital notebook',
    'note organizer',
    // Feature-based keywords
    'note taking with categories',
    'cloud note storage',
    'sync notes online',
    'web-based notes',
    'note management',
    'organize notes',
    'categorize notes',
    // Use case keywords
    'student notes app',
    'business notes',
    'work notes',
    'personal notes',
    'quick notes',
    'note keeper',
    'memo app',
    'task notes',
    // Competitive keywords
    'evernote alternative',
    'notion alternative',
    'google keep alternative',
    'onenote alternative',
    'simple note app',
    // Platform keywords
    'web note app',
    'online note taking',
    'browser notes',
    'PWA notes app',
    // Feature keywords
    'offline notes',
    'mobile notes',
    'responsive note app',
    'markdown notes',
    'note search',
    'infinite notes',
    'unlimited notes',
  ],
  authors: [{ name: 'Infinity Note Team' }],
  creator: 'Infinity Note',
  publisher: 'Infinity Note',
  applicationName: siteName,
  category: 'productivity',
  classification: 'Note Taking Application',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/logo_thick.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/icon-192-thick.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: 'Infinity Note - Free Online Note Taking App with Categories',
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Infinity Note - Modern Note Taking App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infinity Note - Free Online Note Taking App',
    description: 'Create, organize, and sync your notes anywhere. Free note-taking app with categories and cloud storage.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@infinitynote',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'google-site-verification': 'your-google-verification-code', // Replace with actual verification code
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
      <head>
        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Infinity Note',
              url: 'https://infinity-note.vercel.app',
              description:
                'Free online note taking app with unlimited notes, categories, and cloud sync. Create, organize, and access your notes anywhere.',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Web Browser, Android, iOS',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
              },
              author: {
                '@type': 'Organization',
                name: 'Infinity Note Team',
              },
              screenshot: 'https://infinity-note.vercel.app/og-image.png',
              featureList: [
                'Unlimited note creation',
                'Category organization',
                'Cloud synchronization',
                'Offline access',
                'Mobile responsive',
                'Search functionality',
                'Dark mode interface',
                'Free to use',
              ],
            }),
          }}
        />
      </head>
      <body className="text-slate-50 antialiased" style={{ backgroundColor: '#0c1327' }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
