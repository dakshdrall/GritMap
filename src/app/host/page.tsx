"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function HostPage() {
  const [name, setName] = useState("");
  const [sportType, setSportType] = useState("Running");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [distance, setDistance] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [price, setPrice] = useState("Free");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/auth");
      else setAuthLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    const { error } = await supabase.from("events").insert({
      name, sport_type: sportType, city, country, date,
      description, distance, difficulty, price,
      registration_url: registrationUrl, organizer_id: user.id,
    });

    if (error) setError(error.message);
    else router.push("/");
    setLoading(false);
  }

  if (authLoading) return <main style={{ background: "#FAFAF7", minHeight: "100vh" }} />;

  const inputStyle = {
    width: "100%",
    height: 48,
    padding: "14px 16px",
    fontSize: 15,
    border: "0.5px solid rgba(0,0,0,0.15)",
    borderRadius: 12,
    background: "#FFFFFF",
    color: "#0A0A0A",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: 11,
    letterSpacing: "0.18em",
    color: "#8A8A82",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
  };

  const fieldGroup = { marginBottom: 24 };

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "64px 32px 96px" }}>

        <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
          List an event
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#0A0A0A", margin: "0 0 8px", lineHeight: 1.05 }}>
          Host your event.
        </h1>
        <p style={{ fontSize: 15, color: "#6B6B66", margin: "0 0 48px", lineHeight: 1.5 }}>
          Add your race, competition, or fitness event to GritMap and reach thousands of athletes.
        </p>

        <form onSubmit={handleSubmit}>

          <div style={fieldGroup}>
            <label style={labelStyle}>Event name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Mumbai Marathon 2025" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Sport</label>
              <select style={inputStyle} value={sportType} onChange={(e) => setSportType(e.target.value)}>
                <option>Running</option>
                <option>Cycling</option>
                <option>Hyrox</option>
                <option>Triathlon</option>
                <option>Trail</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty</label>
              <select style={inputStyle} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Elite</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Mumbai" />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="India" />
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Date</label>
            <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Distance</label>
              <input style={inputStyle} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="42.2km" />
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Free or ₹2500" />
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Registration URL</label>
            <input style={inputStyle} type="url" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: 120, resize: "vertical", paddingTop: 14 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell athletes what makes this event special..."
            />
          </div>

          {error && <p style={{ fontSize: 13, color: "#C44A2E", margin: "0 0 16px", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", height: 52, background: "#0A0A0A", color: "#FAFAF7", border: "none", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", marginTop: 24, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Publishing..." : "Publish event →"}
          </button>

        </form>

      </section>
    </main>
  );
}
