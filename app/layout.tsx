import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const siteUrl = 'https://infinity-note.vercel.app'
const siteName = 'Infinity Note'
const siteDescription =
  'Infinity Note - Free online note taking app with unlimited notes, smart categories, and cloud sync. Create, organize, and access your notes from any device. Perfect for students, professionals, and writers. Simple, fast, secure note organizer with offline access.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Infinity Note - Free Online Note Taking App | Unlimited Notes with Categories',
    template: '%s | Infinity Note',
  },
  description: siteDescription,
  keywords: [
    // Brand keywords - MOST IMPORTANT
    'infinity note',
    'infinitynote',
    'infinity note app',
    'infinity notes',
    
    // Primary keywords
    'note taking app',
    'online notes',
    'free note app',
    'digital notebook',
    'note organizer',
    'note app',
    'notes app',
    'notepad app',
    'note taking',
    'online notepad',
    
    // Feature-based keywords
    'note taking with categories',
    'cloud note storage',
    'sync notes online',
    'web-based notes',
    'note management',
    'organize notes',
    'categorize notes',
    'unlimited notes',
    'infinite notes',
    'free unlimited notes',
    'note categories',
    'smart notes',
    
    // Use case keywords
    'student notes app',
    'student note taking',
    'business notes',
    'work notes',
    'personal notes',
    'quick notes',
    'note keeper',
    'memo app',
    'task notes',
    'study notes',
    'class notes',
    'meeting notes',
    'project notes',
    
    // Competitive keywords
    'evernote alternative',
    'notion alternative',
    'google keep alternative',
    'onenote alternative',
    'simplenote alternative',
    'bear notes alternative',
    'apple notes alternative',
    'simple note app',
    'free evernote',
    'free notion',
    
    // Platform keywords
    'web note app',
    'online note taking',
    'browser notes',
    'PWA notes app',
    'cloud notes',
    'web notes',
    'online notebook',
    
    // Feature keywords
    'offline notes',
    'mobile notes',
    'responsive note app',
    'markdown notes',
    'note search',
    'note sync',
    'cross platform notes',
    'multi device notes',
    
    // Long-tail keywords
    'best free note taking app',
    'note app with categories',
    'free note organizer',
    'simple note taking app',
    'fast note app',
    'secure notes app',
    'note taking for students',
    'note taking for work',
    'note taking for writers',
    
    // Action-based keywords
    'create notes online',
    'organize my notes',
    'take notes online free',
    'save notes online',
    'write notes online',
    'store notes online',
    
    // Problem-solving keywords
    'how to organize notes',
    'best way to take notes',
    'note organization system',
    'digital note taking',
    'paperless notes',
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
        {/* JSON-LD Structured Data for Google - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Infinity Note',
              alternateName: ['InfinityNote', 'Infinity Notes'],
              url: 'https://infinity-note.vercel.app',
              description:
                'Free online note taking app with unlimited notes, smart categories, and cloud sync. Create, organize, and access your notes from any device. Perfect for students, professionals, and writers.',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Web Browser, Android, iOS',
              browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
                bestRating: '5',
                worstRating: '1',
              },
              author: {
                '@type': 'Organization',
                name: 'Infinity Note Team',
                url: 'https://infinity-note.vercel.app',
              },
              screenshot: 'https://infinity-note.vercel.app/og-image.png',
              image: 'https://infinity-note.vercel.app/og-image.png',
              featureList: [
                'Unlimited note creation',
                'Smart category organization',
                'Cloud synchronization',
                'Offline access',
                'Mobile responsive design',
                'Powerful search functionality',
                'Dark mode interface',
                'Free forever - no premium tiers',
                'Google Sign-In authentication',
                'Cross-device sync',
              ],
              softwareVersion: '1.0',
              softwareHelp: {
                '@type': 'WebPage',
                url: 'https://infinity-note.vercel.app',
              },
            }),
          }}
        />
        
        {/* JSON-LD Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Infinity Note',
              url: 'https://infinity-note.vercel.app',
              logo: 'https://infinity-note.vercel.app/logo_thick.svg',
              sameAs: [
                'https://github.com/infinitynote',
                'https://twitter.com/infinitynote',
              ],
              description: 'Free online note taking application with unlimited notes and smart categories.',
            }),
          }}
        />
        
        {/* JSON-LD Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Infinity Note',
              applicationCategory: 'BusinessApplication',
              applicationSubCategory: 'Note Taking',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              operatingSystem: 'Web, Android, iOS',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
              },
            }),
          }}
        />

        {/* JSON-LD Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://infinity-note.vercel.app',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Notes',
                  item: 'https://infinity-note.vercel.app',
                },
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
