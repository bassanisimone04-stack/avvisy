"use client";
import { useEffect } from "react";

/** Remembers the last guide read in this tab so store clicks can be attributed to it (sessionStorage, never leaves the browser except as a click parameter). */
export function ArticleRef({ slug }: { slug: string }) {
  useEffect(() => { try { sessionStorage.setItem("ss-art", slug); } catch { /* blocked */ } }, [slug]);
  return null;
}

export function TrackedLink({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const attach = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    try {
      const art = sessionStorage.getItem("ss-art");
      if (art && !e.currentTarget.href.includes("&art=")) e.currentTarget.href += `&art=${encodeURIComponent(art)}`;
    } catch { /* blocked */ }
  };
  return <a href={href} onPointerDown={attach} onClick={attach} onFocus={attach} {...rest}>{children}</a>;
}
