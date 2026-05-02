import { createClient } from '@/utils/supabase/server'
import EventsExplorer from '@/components/EventsExplorer'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main>
      <section className="bg-gradient-to-b from-[#0d1f3c] to-[#0A1628] py-20 px-4 text-center">
        <p className="text-[#00D4AA] text-sm font-semibold tracking-widest uppercase mb-4">
          Fitness Event Discovery
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
          Find. Join.{' '}
          <span className="text-[#00D4AA]">Dominate.</span>
        </h1>
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
          Discover Hyrox, marathons, cycling races, triathlons and more — worldwide.
        </p>
      </section>

      <EventsExplorer initialEvents={events ?? []} />
    </main>
  )
}
