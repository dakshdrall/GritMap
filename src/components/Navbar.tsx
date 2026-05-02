'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-[#0A1628] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-[#00D4AA] font-bold text-xl tracking-tight">
          GritMap
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Discover
          </Link>
          <Link href="/host" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Host
          </Link>
          {userEmail ? (
            <>
              <Link href="/profile" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[#64748B] hover:text-white text-sm transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-[#00D4AA] text-[#0A1628] text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#00bfa0] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
