"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/profile");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError("Check your email to confirm your account.");
    }
    setLoading(false);
  }

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
    marginBottom: 12,
  };

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginBottom: 16, textAlign: "center" }}>
          {mode === "signin" ? "Welcome back" : "Join GritMap"}
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", color: "#0A0A0A", textAlign: "center", margin: "0 0 8px" }}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>

        <p style={{ fontSize: 14, color: "#6B6B66", textAlign: "center", margin: "0 0 40px" }}>
          {mode === "signin" ? "Continue to your account" : "Find every event worth showing up for"}
        </p>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle, marginBottom: 24 }} />

          {error && <p style={{ fontSize: 13, color: "#C44A2E", margin: "0 0 16px", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", height: 48, background: "#0A0A0A", color: "#FAFAF7", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : (mode === "signin" ? "Sign in" : "Create account")}
          </button>
        </form>

        <p style={{ fontSize: 13, color: "#6B6B66", textAlign: "center", margin: "32px 0 0" }}>
          {mode === "signin" ? "New to GritMap? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            style={{ background: "none", border: "none", padding: 0, color: "#0A0A0A", textDecoration: "underline", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>

      </div>
    </main>
  );
}
