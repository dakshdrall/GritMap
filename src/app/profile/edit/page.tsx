"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [strava, setStrava] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (!profile) {
        await supabase.from("profiles").insert({ id: user.id });
      } else {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setInstagram(profile.instagram || "");
        setStrava(profile.strava || "");
        setWebsite(profile.website || "");
        setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(urlData.publicUrl);
    setUploadingAvatar(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const cleanInstagram = instagram.replace(/^@/, "").trim();
    const cleanStrava = strava.trim();
    const cleanWebsite = website.trim();

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        instagram: cleanInstagram || null,
        strava: cleanStrava || null,
        website: cleanWebsite || null,
        avatar_url: avatarUrl,
      });

    if (updateError) setError(updateError.message);
    else {
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 800);
    }
    setSaving(false);
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

  if (loading) return <main style={{ background: "#FAFAF7", minHeight: "100vh" }} />;

  const initials = (displayName || "U").substring(0, 2).toUpperCase();

  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "48px 32px 96px" }}>

        <a href="/profile" style={{ fontSize: 13, color: "#6B6B66", marginBottom: 32, display: "inline-block" }}>
          ← Back to profile
        </a>

        <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, marginTop: 32, marginBottom: 16 }}>
          Your profile
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#0A0A0A", margin: "0 0 48px", lineHeight: 1.05 }}>
          Edit profile.
        </h1>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Avatar</label>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "0.5px solid rgba(0,0,0,0.08)" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F0EFE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 500, color: "#0A0A0A", letterSpacing: "0.05em" }}>
                  {initials}
                </div>
              )}
              <label style={{ background: "transparent", color: "#0A0A0A", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 500, cursor: uploadingAvatar ? "wait" : "pointer", opacity: uploadingAvatar ? 0.6 : 1 }}>
                {uploadingAvatar ? "Uploading..." : avatarUrl ? "Change" : "Upload"}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} style={{ display: "none" }} />
              </label>
            </div>
            <p style={{ fontSize: 11, color: "#8A8A82", marginTop: 12 }}>JPG or PNG, max 2MB.</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Display name</label>
            <input style={inputStyle} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What people will see" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, height: 100, resize: "vertical", paddingTop: 14, lineHeight: 1.5 }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A line or two about you and what you train for..."
              maxLength={200}
            />
            <p style={{ fontSize: 11, color: "#8A8A82", marginTop: 6, textAlign: "right" }}>{bio.length}/200</p>
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#8A8A82", textTransform: "uppercase", fontWeight: 500, margin: "32px 0 16px", paddingTop: 24, borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
            Links
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Instagram</label>
            <input style={inputStyle} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="yourhandle" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Strava</label>
            <input style={inputStyle} value={strava} onChange={(e) => setStrava(e.target.value)} placeholder="athlete ID or full URL" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Website</label>
            <input style={inputStyle} type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yoursite.com" />
          </div>

          {error && <p style={{ fontSize: 13, color: "#C44A2E", margin: "16px 0", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ fontSize: 13, color: "#2D7A3D", margin: "16px 0", textAlign: "center" }}>Saved! Redirecting...</p>}

          <button
            type="submit"
            disabled={saving}
            style={{ width: "100%", height: 52, background: "#0A0A0A", color: "#FAFAF7", border: "none", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: saving ? "wait" : "pointer", fontFamily: "inherit", marginTop: 24, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

        </form>

      </section>
    </main>
  );
}
