import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Storage delle foto: "local" (disco, per sviluppo) oppure "s3" (qualunque object storage S3-compatibile).

export const MAX_PHOTO_BYTES = 6 * 1024 * 1024;
export const MAX_PHOTOS = 10;

const TYPES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
];

/** Riconosce il formato dai byte reali del file, non dal nome o dal Content-Type dichiarato. */
export function detectImage(buf: Buffer): { mime: string; ext: string } | null {
  const t = TYPES.find((x) => x.test(buf));
  return t ? { mime: t.mime, ext: t.ext } : null;
}

export const mimeForKey = (key: string) => TYPES.find((t) => key.endsWith("." + t.ext))?.mime ?? "application/octet-stream";

const localDir = () => path.join(process.cwd(), ".data", "uploads");
const driver = () => (process.env.STORAGE_DRIVER === "s3" ? "s3" : "local");

async function s3() {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const client = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.S3_ENDPOINT,
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" },
  });
  return { client, PutObjectCommand };
}

export async function savePhoto(buf: Buffer): Promise<string> {
  const type = detectImage(buf);
  if (!type) throw new Error("Formato immagine non supportato (usa JPG, PNG o WebP).");
  if (buf.length > MAX_PHOTO_BYTES) throw new Error("Foto troppo grande (massimo 6 MB).");
  const key = `listings/${crypto.randomUUID()}.${type.ext}`;
  if (driver() === "s3") {
    const { client, PutObjectCommand } = await s3();
    await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: buf, ContentType: type.mime, CacheControl: "public, max-age=31536000, immutable" }));
  } else {
    const file = path.join(localDir(), key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, buf);
  }
  return key;
}

/** URL pubblico di una foto. */
export function photoUrl(key: string): string {
  if (key.startsWith("http")) return key;
  if (driver() === "s3" && process.env.S3_PUBLIC_BASE_URL) return `${process.env.S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  return `/media/${key}`;
}

/** Lettura per il driver locale (servita da /media/...). */
export async function readLocalPhoto(key: string): Promise<Buffer | null> {
  if (!/^listings\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) return null;
  try {
    return await fs.readFile(path.join(localDir(), key));
  } catch {
    return null;
  }
}
