const SPORT_EMOJIS: Record<string, string> = {
  Running: '🏃',
  Cycling: '🚴',
  Hyrox: '💪',
  Triathlon: '🏊',
  Trail: '🥾',
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-amber-500/20 text-amber-400',
  Hard: 'bg-orange-500/20 text-orange-400',
  Elite: 'bg-red-500/20 text-red-400',
}

export type Event = {
  id: string
  name: string
  sport_type: string
  city: string
  country: string
  date: string
  description: string | null
  distance: string | null
  difficulty: string | null
  price: string
  registration_url: string | null
  organizer_id: string | null
  created_at: string
}

export default function EventCard({ event }: { event: Event }) {
  const emoji = SPORT_EMOJIS[event.sport_type] ?? '🏆'
  const diffStyle = event.difficulty ? (DIFFICULTY_STYLES[event.difficulty] ?? 'bg-white/10 text-white/60') : null

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#00D4AA]/50 hover:bg-white/[0.07] transition-all cursor-pointer group h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{emoji}</span>
        {diffStyle && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffStyle}`}>
            {event.difficulty}
          </span>
        )}
      </div>
      <h3 className="text-white font-semibold text-base mb-1 group-hover:text-[#00D4AA] transition-colors leading-snug flex-1">
        {event.name}
      </h3>
      <p className="text-[#64748B] text-sm mb-3">
        {event.city}, {event.country}
      </p>
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>{formattedDate}</span>
        <span className="text-[#00D4AA] font-medium">{event.price}</span>
      </div>
      {event.distance && (
        <p className="text-white/30 text-xs mt-2">{event.distance}</p>
      )}
    </div>
  )
}
