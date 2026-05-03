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

  return (
    <html lang="en">
      <body className={geist.variable} style={{ background: "#FAFAF7", margin: 0, fontFamily: "var(--font-geist-sans), system-ui" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "0.5px solid rgba(0,0,0,0.08)", maxWidth: 1200, margin: "0 auto" }}>
          <a href="/" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.18em", color: "#0A0A0A" }}>GRITMAP</a>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <a href="/" style={{ fontSize: 13, color: "#6B6B66", padding: "8px 14px" }}>Discover</a>
            <a href="/host" style={{ fontSize: 13, color: "#6B6B66", padding: "8px 14px" }}>Host</a>
            {user ? (
              <a href="/profile" style={{ background: "#0A0A0A", color: "#FAFAF7", padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500, marginLeft: 8 }}>
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
