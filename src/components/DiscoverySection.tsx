'use client'

import { useState } from 'react'
import Link from 'next/link'

type Event = {
  id: string
  name: string
  sport_type: string
  city: string
  country: string
  date: string
  distance: string | null
  difficulty: string | null
  price: string
}

const SPORTS = ['All', 'Running', 'Cycling', 'Hyrox', 'Triathlon', 'Trail']

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#2D7A3D',
  Medium: '#B8862E',
  Hard: '#C44A2E',
  Elite: '#8B2D2D',
}

function formatMonthYear(dateString: string): string {
  const d = new Date(dateString + 'T00:00:00')
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export default function DiscoverySection({ events }: { events: Event[] }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = events.filter(event => {
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
    <>
      <section style={{ padding: '0 28px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search by event, city, or country"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SPORTS.map(sport => (
            <button
              key={sport}
              onClick={() => setActiveFilter(sport)}
              className={`pill${activeFilter === sport ? ' active' : ''}`}
            >
              {sport}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: '24px 28px 96px', maxWidth: 1200, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <p style={{ color: '#8A8A82', textAlign: 'center', padding: '64px 0', fontSize: 15 }}>
            No events found.
          </p>
        ) : (
          <div className="events-grid">
            {filtered.map(event => {
              const diffColor = event.difficulty
                ? (DIFFICULTY_COLORS[event.difficulty] ?? '#8A8A82')
                : null

              return (
                <Link key={event.id} href={`/events/${event.id}`} className="event-card">
                  <div className="card-meta">
                    <span>
                      {event.sport_type.toUpperCase()}
                      {event.difficulty && diffColor && (
                        <>
                          {' · '}
                          <span style={{ color: diffColor }}>
                            {event.difficulty.toUpperCase()}
                          </span>
                        </>
                      )}
                    </span>
                    <span>{formatMonthYear(event.date)}</span>
                  </div>
                  <h3>{event.name}</h3>
                  <p className="loc">{event.city}, {event.country}</p>
                  <div className="divider" />
                  <div className="bottom">
                    <span className="distance">{event.distance ?? '—'}</span>
                    <span className="price">{event.price}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
