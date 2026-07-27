"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useDictionary } from "@/lib/i18n/useLocale";

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useDictionary();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard non disponibile
    }
  }

  const links = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Twitter/X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-ink-soft">{t.blog.shareLabel}</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${l.label}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink-soft hover:bg-brand-soft hover:text-brand-dark">
          <l.icon size={15} />
        </a>
      ))}
      <button type="button" onClick={copyLink} aria-label="Copy link" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink-soft hover:bg-brand-soft hover:text-brand-dark">
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
