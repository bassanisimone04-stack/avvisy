import dns from "node:dns/promises";
import net from "node:net";

// Scarica un URL fornito dall'utente (feed iCal) evitando SSRF verso la rete interna.

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
}

export function normalizeFeedUrl(raw: string): URL | null {
  let s = raw.trim();
  if (s.toLowerCase().startsWith("webcal://")) s = "https://" + s.slice(9);
  try {
    const u = new URL(s);
    if (u.protocol !== "https:") return null;
    return u;
  } catch {
    return null;
  }
}

export async function fetchPublicText(url: URL, maxBytes = 3_000_000): Promise<string> {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    const addrs = await dns.lookup(current.hostname, { all: true });
    if (addrs.length === 0 || addrs.some((a) => isPrivateIp(a.address))) {
      throw new Error("Indirizzo del calendario non consentito.");
    }
    const res = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(10000), headers: { Accept: "text/calendar" } });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      const next = loc ? normalizeFeedUrl(new URL(loc, current).toString()) : null;
      if (!next) throw new Error("Redirect del calendario non valido.");
      current = next;
      continue;
    }
    if (!res.ok || !res.body) throw new Error(`Il calendario ha risposto con HTTP ${res.status}.`);
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("Calendario troppo grande.");
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  throw new Error("Troppi redirect.");
}
