import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const difficultyColor: Record<string, string> = {
  Easy: "#2D7A3D",
  Medium: "#B8862E",
  Hard: "#C44A2E",
  Elite: "#8B2D2D",
};

function formatMonthYear(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: savedRecords } = await supabase
    .from("saved_events")
    .select("event_id")
    .eq("user_id", user.id);

  const eventIds = savedRecords?.map((r: any) => r.event_id) || [];
  const { data: savedEvents } = eventIds.length > 0
    ? await supabase.from("events").select("*").in("id", eventIds)
    : { data: [] };

  const initials = (user.email || "U").substring(0, 2).toUpperCase();

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px 96px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 64 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0EFE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#0A0A0A", letterSpacing: "0.05em" }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
              {user.email?.split("@")[0]}
            </div>
            <div style={{ fontSize: 13, color: "#6B6B66" }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, padding: "24px 0", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)", marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1 }}>0</div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>XP</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1 }}>{savedEvents?.length || 0}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>Saved</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: 1 }}>0</div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#8A8A82", textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>Completed</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", margin: 0, letterSpacing: "-0.01em" }}>Saved events</h2>
          <span style={{ fontSize: 11, color: "#8A8A82", letterSpacing: "0.1em", textTransform: "uppercase" }}>{savedEvents?.length || 0} events</span>
        </div>

        {(!savedEvents || savedEvents.length === 0) ? (
          <div style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "64px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 15, color: "#6B6B66", margin: "0 0 16px" }}>You haven&apos;t saved any events yet.</p>
            <a href="/" style={{ fontSize: 13, color: "#0A0A0A", textDecoration: "underline" }}>Discover events →</a>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {savedEvents.map((event: any) => (
              <a
                key={event.id}
                href={`/events/${event.id}`}
                style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", minHeight: 220 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>
                  <span style={{ color: difficultyColor[event.difficulty] || "#6B6B66" }}>{event.sport_type} · {event.difficulty}</span>
                  <span style={{ color: "#8A8A82" }}>{formatMonthYear(event.date)}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", color: "#0A0A0A", margin: "28px 0 4px", lineHeight: 1.1 }}>{event.name}</h3>
                <p style={{ fontSize: 13, color: "#6B6B66", margin: "0 0 auto" }}>{event.city}, {event.country}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 11, color: "#8A8A82", letterSpacing: "0.05em" }}>{event.distance}</span>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A" }}>{event.price}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        <form action="/auth/signout" method="post" style={{ marginTop: 64 }}>
          <button type="submit" style={{ background: "transparent", color: "#6B6B66", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Sign out
          </button>
        </form>

      </section>
    </main>
  );
}
