import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "GritMap — Find your next start line",
  description: "Discover Hyrox, marathons, cycling races, triathlons worldwide.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  let displayName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, display_name")
      .eq("id", user.id)
      .single();
    avatarUrl = profile?.avatar_url || null;
    displayName = profile?.display_name || user.email?.split("@")[0] || "U";
  }
  const initials = (displayName || "U").substring(0, 2).toUpperCase();

  return (
    <html lang="en">
      <body className={geist.variable} style={{ background: "#FAFAF7", margin: 0, fontFamily: "var(--font-geist-sans), system-ui" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "0.5px solid rgba(0,0,0,0.08)", maxWidth: 1200, margin: "0 auto" }}>
          <a href="/" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.18em", color: "#0A0A0A" }}>GRITMAP</a>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <a href="/" style={{ fontSize: 13, color: "#6B6B66", padding: "8px 14px" }}>Discover</a>
            <a href="/host" style={{ fontSize: 13, color: "#6B6B66", padding: "8px 14px" }}>Host</a>
            {user ? (
              <a href="/profile" style={{ display: "flex", alignItems: "center", gap: 8, background: "#0A0A0A", color: "#FAFAF7", padding: "5px 14px 5px 5px", borderRadius: 999, fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#FAFAF7", color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", flexShrink: 0 }}>
                    {initials}
                  </span>
                )}
                Profile
              </a>
            ) : (
              <a href="/auth" style={{ background: "#0A0A0A", color: "#FAFAF7", padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
                Sign in
              </a>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
