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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
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

        <p style={{ fontSize: 14, color: "#6B6B66", textAlign: "center", margin: "0 0 32px" }}>
          {mode === "signin" ? "Continue to your account" : "Find every event worth showing up for"}
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{ width: "100%", height: 48, background: "#FFFFFF", color: "#0A0A0A", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: googleLoading ? "wait" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: googleLoading ? 0.6 : 1, marginBottom: 24 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {googleLoading ? "Connecting..." : `Continue with Google`}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
        </div>

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
