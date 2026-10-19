/** Extracts a YouTube video id from watch/share/embed URLs; returns null for anything else (no other hosts are embedded). */
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0] || null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else { const m = /^\/(?:embed|shorts|live)\/([^/?]+)/.exec(u.pathname); id = m ? m[1] : null; }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
