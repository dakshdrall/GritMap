import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SaveButton from '@/components/SaveButton'

const SPORT_EMOJIS: Record<string, string> = {
  Running: '🏃',
  Cycling: '🚴',
  Hyrox: '💪',
  Triathlon: '🏊',
  Trail: '🥾',
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Elite: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: { user } }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!event) notFound()

  const emoji = SPORT_EMOJIS[event.sport_type] ?? '🏆'
  const diffStyle = event.difficulty
    ? (DIFFICULTY_STYLES[event.difficulty] ?? 'bg-white/10 text-white/60 border-white/20')
    : null

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-[#64748B] hover:text-white text-sm mb-8 inline-block transition-colors">
        ← Back to events
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <span className="text-5xl">{emoji}</span>
          {diffStyle && (
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${diffStyle}`}>
              {event.difficulty}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
        <p className="text-[#64748B] text-lg mb-8">{event.city}, {event.country}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Date', value: formattedDate },
            { label: 'Distance', value: event.distance ?? '—' },
            { label: 'Price', value: event.price, teal: true },
            { label: 'Sport', value: event.sport_type },
          ].map(({ label, value, teal }) => (
            <div key={label} className="bg-white/5 rounded-xl p-4">
              <p className="text-[#64748B] text-xs mb-1">{label}</p>
              <p className={`text-sm font-medium ${teal ? 'text-[#00D4AA]' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </div>

        {event.description && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-2">About this event</h2>
            <p className="text-[#64748B] leading-relaxed">{event.description}</p>
          </div>
        )}

        <div className="flex gap-3">
          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#00D4AA] text-[#0A1628] font-semibold py-3 px-6 rounded-xl text-center hover:bg-[#00bfa0] transition-colors"
            >
              Register Now →
            </a>
          )}
          <SaveButton eventId={event.id} userId={user?.id ?? null} />
        </div>
      </div>
    </main>
  )
}
