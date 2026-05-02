'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const SPORTS = ['Running', 'Cycling', 'Hyrox', 'Triathlon', 'Trail']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Elite']

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4AA] transition-colors'
const selectClass =
  'w-full bg-[#0d1f3c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] transition-colors'
const labelClass = 'block text-white/60 text-xs mb-1.5'

export default function HostPage() {
  const [form, setForm] = useState({
    name: '',
    sport_type: 'Running',
    city: '',
    country: '',
    date: '',
    description: '',
    distance: '',
    difficulty: 'Medium',
    price: '',
    registration_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }

    const { error } = await supabase.from('events').insert({ ...form, organizer_id: user.id })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Host an Event</h1>
      <p className="text-[#64748B] mb-8">Share your fitness event with the GritMap community.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Event Name *</label>
            <input required value={form.name} onChange={set('name')} className={inputClass} placeholder="e.g. Hyrox London 2025" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sport *</label>
              <select value={form.sport_type} onChange={set('sport_type')} className={selectClass}>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Difficulty *</label>
              <select value={form.difficulty} onChange={set('difficulty')} className={selectClass}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input required value={form.city} onChange={set('city')} className={inputClass} placeholder="Mumbai" />
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input required value={form.country} onChange={set('country')} className={inputClass} placeholder="India" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" required value={form.date} onChange={set('date')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price</label>
              <input value={form.price} onChange={set('price')} className={inputClass} placeholder="Free or ₹500" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Distance</label>
            <input value={form.distance} onChange={set('distance')} className={inputClass} placeholder="e.g. 42.2km" />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Tell athletes about your event..."
            />
          </div>

          <div>
            <label className={labelClass}>Registration URL</label>
            <input type="url" value={form.registration_url} onChange={set('registration_url')} className={inputClass} placeholder="https://..." />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00D4AA] text-[#0A1628] font-semibold py-3 rounded-xl hover:bg-[#00bfa0] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </main>
  )
}
