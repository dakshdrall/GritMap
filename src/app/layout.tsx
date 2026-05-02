import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'GritMap — Find. Join. Dominate.',
  description: 'Discover fitness events worldwide. Hyrox, marathons, cycling races, triathlons and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#0A1628] text-white min-h-screen font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
