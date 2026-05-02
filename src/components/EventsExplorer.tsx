'use client'

import { useState } from 'react'
import Link from 'next/link'
import EventCard, { type Event } from './EventCard'

const SPORTS = ['All', 'Running', 'Cycling', 'Hyrox', 'Triathlon', 'Trail']

export default function EventsExplorer({ initialEvents }: { initialEvents: Event[] }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = initialEvents.filter(event => {
    const matchesSport = activeFilter === 'All' || event.sport_type === activeFilter
    const q = search.toLowerCase()
    const matchesSearch =
      q === '' ||
      event.name.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.country.toLowerCase().includes(q)
    return matchesSport && matchesSearch
  })

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <input
        type="text"
        placeholder="Search events, cities, countries..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00D4AA] transition-colors mb-5"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {SPORTS.map(sport => (
          <button
            key={sport}
            onClick={() => setActiveFilter(sport)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === sport
                ? 'bg-[#00D4AA] text-[#0A1628]'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#64748B] text-center py-20">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <Link key={event.id} href={`/events/${event.id}`} className="flex">
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
