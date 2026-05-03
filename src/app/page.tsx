import { createClient } from "@/utils/supabase/server";

function formatMonthYear(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

const difficultyColor: Record<string, string> = {
  Easy: "#2D7A3D",
  Medium: "#B8862E",
  Hard: "#C44A2E",
  Elite: "#8B2D2D",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("date", { ascending: true });

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "end" }} className="hero-grid">
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 28, height: "0.5px", background: "#8A8A82", display: "inline-block" }}></span>
            Built for athletes
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 0.96, letterSpacing: "-0.04em", color: "#0A0A0A", fontWeight: 500, margin: "0 0 24px" }}>
            Find your<br />next start line.
          </h1>
          <p style={{ fontSize: 16, color: "#6B6B66", maxWidth: 440, lineHeight: 1.55, margin: 0 }}>
            Hyrox, marathons, cycling, triathlons — every event worth showing up for, in one place.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1 }}>{events?.length || 0}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>Events live</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1 }}>
              {new Set(events?.map((e: { country: string }) => e.country)).size || 0}
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>Countries</div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 16px" }}>
        <input
          placeholder="Search by event, city, or country"
          style={{ width: "100%", background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "14px 18px", fontSize: 15, color: "#0A0A0A", marginBottom: 20, outline: "none", fontFamily: "inherit", display: "block" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Running", "Cycling", "Hyrox", "Triathlon", "Trail"].map((p, i) => (
            <span key={p} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 500, borderRadius: 999,
              border: i === 0 ? "0.5px solid #0A0A0A" : "0.5px solid rgba(0,0,0,0.12)",
              background: i === 0 ? "#0A0A0A" : "transparent",
              color: i === 0 ? "#FAFAF7" : "#6B6B66",
              cursor: "pointer",
            }}>{p}</span>
          ))}
        </div>
      </section>

      {/* SECTION HEADER */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", margin: 0, letterSpacing: "-0.01em" }}>Upcoming events</h2>
        <span style={{ fontSize: 11, color: "#8A8A82", letterSpacing: "0.1em", textTransform: "uppercase" }}>{events?.length || 0} results</span>
      </section>

      {/* GRID */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {events?.map((event: { id: string; sport_type: string; difficulty: string; date: string; name: string; city: string; country: string; distance: string; price: string }) => (
            <a
              key={event.id}
              href={`/events/${event.id}`}
              className="event-card"
              style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", minHeight: 220, transition: "all 200ms ease", textDecoration: "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>
                <span style={{ color: difficultyColor[event.difficulty] || "#6B6B66" }}>
                  {event.sport_type} · {event.difficulty}
                </span>
                <span style={{ color: "#8A8A82" }}>{formatMonthYear(event.date)}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", color: "#0A0A0A", margin: "28px 0 4px", lineHeight: 1.1 }}>{event.name}</h3>
              <p style={{ fontSize: 13, color: "#6B6B66", margin: "0 0 auto" }}>{event.city}, {event.country}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: 11, color: "#8A8A82", letterSpacing: "0.05em" }}>{event.distance}</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A", letterSpacing: "-0.01em" }}>{event.price}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <style>{`
        .event-card:hover { border-color: rgba(0,0,0,0.15) !important; transform: translateY(-2px); }
        @media (max-width: 760px) { .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </main>
  );
}
