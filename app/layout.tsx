import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jobify - Find Your Perfect Career',
  description: 'AI-powered job matching platform',
  icons: {
    icon: '/assets/Jobify.png',
    shortcut: '/assets/Jobify.png',
    apple: '/assets/Jobify.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

