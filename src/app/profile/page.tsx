import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const [{ data: profile }, { data: savedRows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('saved_events')
      .select('events(*)')
      .eq('user_id', user.id),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedEvents = ((savedRows ?? []) as any[]).map((r: any) => r.events ?? {})

  const displayName = profile?.name ?? user.email ?? 'Athlete'
  const initial = displayName[0].toUpperCase()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#00D4AA]/20 border-2 border-[#00D4AA]/40 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-[#00D4AA]">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-xl truncate">{displayName}</h1>
          <p className="text-[#64748B] text-sm">{user.email}</p>
        </div>
        <div className="text-center shrink-0">
          <p className="text-[#00D4AA] text-3xl font-bold">{profile?.xp ?? 0}</p>
          <p className="text-[#64748B] text-xs uppercase tracking-wide">XP</p>
        </div>
      </div>

      <h2 className="text-white font-semibold text-lg mb-4">
        Saved Events
        {savedEvents.length > 0 && (
          <span className="text-[#64748B] text-sm font-normal ml-2">({savedEvents.length})</span>
        )}
      </h2>

      {savedEvents.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-[#64748B] mb-2">No saved events yet.</p>
          <Link href="/" className="text-[#00D4AA] text-sm hover:underline">
            Browse events →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedEvents.map(event => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00D4AA]/40 transition-colors flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{event.name}</p>
                  <p className="text-[#64748B] text-sm">{event.city}, {event.country}</p>
                </div>
                <span className="text-[#00D4AA] text-sm font-medium shrink-0">{event.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
