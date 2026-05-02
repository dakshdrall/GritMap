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
    <nav className="gm-nav bg-[#FAFAF7] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-7 max-md:px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-[#0A0A0A] font-medium text-[15px] uppercase tracking-[0.05em]"
        >
          GRITMAP
        </Link>

        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="text-[13px] text-[#6B6B66] hover:text-[#0A0A0A] transition-colors duration-150"
          >
            Discover
          </Link>
          <Link
            href="/host"
            className="text-[13px] text-[#6B6B66] hover:text-[#0A0A0A] transition-colors duration-150"
          >
            Host
          </Link>

          {userEmail ? (
            <>
              <Link
                href="/profile"
                className="text-[13px] text-[#6B6B66] hover:text-[#0A0A0A] transition-colors duration-150"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[13px] text-[#6B6B66] hover:text-[#0A0A0A] transition-colors duration-150"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-[#0A0A0A] text-[#FAFAF7] text-[13px] font-medium px-[18px] py-2 rounded-full hover:bg-[#1f1f1f] transition-colors duration-150"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
