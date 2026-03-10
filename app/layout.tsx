import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'Infinity Note',
  description: 'A modern note-taking application',
  themeColor: '#1D4ED8',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

