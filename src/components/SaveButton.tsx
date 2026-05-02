'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SaveButton({ eventId, userId }: { eventId: string; userId: string | null }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!userId) return
    supabase
      .from('saved_events')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data))
  }, [eventId, userId])

  const toggle = async () => {
    if (!userId) {
      router.push('/auth')
      return
    }
    setLoading(true)
    if (saved) {
      await supabase.from('saved_events').delete().eq('event_id', eventId).eq('user_id', userId)
      setSaved(false)
    } else {
      await supabase.from('saved_events').insert({ event_id: eventId, user_id: userId })
      setSaved(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-6 py-3 rounded-xl font-semibold transition-all border disabled:opacity-50 ${
        saved
          ? 'bg-[#00D4AA]/10 border-[#00D4AA] text-[#00D4AA]'
          : 'bg-white/5 border-white/20 text-white hover:border-white/40'
      }`}
    >
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  )
}
