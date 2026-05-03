import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

const difficultyColor: Record<string, string> = {
  Easy: "#2D7A3D",
  Medium: "#B8862E",
  Hard: "#C44A2E",
  Elite: "#8B2D2D",
};

function formatLongDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 96px" }}>

        <a href="/" style={{ fontSize: 13, color: "#6B6B66", marginBottom: 48, display: "inline-block" }}>
          ← Back to events
        </a>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, marginTop: 32, marginBottom: 24 }}>
          <span style={{ color: difficultyColor[event.difficulty] || "#6B6B66" }}>
            {event.sport_type} · {event.difficulty}
          </span>
          <span style={{ color: "#8A8A82" }}>{formatLongDate(event.date)}</span>
        </div>

        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 0.96, letterSpacing: "-0.04em", color: "#0A0A0A", fontWeight: 500, margin: "0 0 12px" }}>
          {event.name}
        </h1>
        <p style={{ fontSize: 18, color: "#6B6B66", margin: "0 0 64px" }}>
          {event.city}, {event.country}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, padding: "32px 0", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>Distance</div>
            <div style={{ fontSize: 16, color: "#0A0A0A", fontWeight: 500 }}>{event.distance || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>Price</div>
            <div style={{ fontSize: 16, color: "#0A0A0A", fontWeight: 500 }}>{event.price}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>Sport</div>
            <div style={{ fontSize: 16, color: "#0A0A0A", fontWeight: 500 }}>{event.sport_type}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>Difficulty</div>
            <div style={{ fontSize: 16, color: difficultyColor[event.difficulty] || "#0A0A0A", fontWeight: 500 }}>{event.difficulty}</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>About this event</div>
          <p style={{ fontSize: 17, color: "#0A0A0A", lineHeight: 1.6, margin: 0 }}>{event.description || "No description provided."}</p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <a
            href={event.registration_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, minWidth: 200, background: "#0A0A0A", color: "#FAFAF7", padding: "18px 32px", borderRadius: 999, fontSize: 15, fontWeight: 500, textAlign: "center", letterSpacing: "0.02em" }}
          >
            Register now →
          </a>
          <button
            style={{ background: "transparent", color: "#0A0A0A", padding: "18px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, border: "0.5px solid rgba(0,0,0,0.15)", cursor: "pointer", fontFamily: "inherit" }}
          >
            ☆ Save
          </button>
        </div>

      </section>
    </main>
  );
}
