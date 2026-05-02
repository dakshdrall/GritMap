import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'GritMap — Find your next start line.',
  description: 'Discover fitness events worldwide. Hyrox, marathons, cycling races, triathlons and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-[#FAFAF7] text-[#0A0A0A] min-h-screen antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
