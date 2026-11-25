"use client";

import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { useLocalState } from "@/features/local-state/store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="nums absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-clay-ink px-1 text-[0.625rem] leading-4 font-semibold text-white">
      {n}
    </span>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-forest-deep/40 data-[state=open]:animate-[fade_200ms]" />
        <Dialog.Content className="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-md bg-ivory p-5 shadow-lift focus:outline-none">
          <Dialog.Title className="font-display text-xl text-forest">Search</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">Workshops, suppliers, digital projects and tools.</Dialog.Description>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onOpenChange(false);
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <label htmlFor="site-search" className="sr-only">
              Search the site
            </label>
            <input
              id="site-search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “CNC router”, “walnut” or “bench”"
              className="h-12 flex-1 rounded-sm border border-line-strong bg-white px-4 text-base focus:border-forest focus:outline-none"
            />
            <button type="submit" className="h-12 rounded-sm bg-forest px-5 text-sm font-medium text-ivory hover:bg-forest-deep">
              Search
            </button>
          </form>
          <Dialog.Close className="absolute top-4 right-4 rounded-sm p-1 text-muted hover:text-forest" aria-label="Close search">
            <X className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { cart, favorites } = useLocalState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabels: Record<string, string> = {
    "/explore/us/woodworking": t("Nav.explore"),
    "/shop": t("Nav.shop"),
    "/tools": t("Nav.tools"),
    "/resources": t("Nav.resources"),
  };
  const isActive = (href: string) => {
    const section = `/${href.split("/")[1]}`;
    return pathname === section || pathname.startsWith(`${section}/`);
  };

  const iconBtn = "relative inline-flex size-10 items-center justify-center rounded-sm text-forest transition-colors hover:bg-forest/[0.06]";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-ivory/92 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-ivory/80",
        scrolled ? "border-line shadow-[0_1px_0_rgb(0_0_0/0.02),0_10px_30px_-20px_rgb(38_59_50/0.35)]" : "border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-sm px-3.5 py-2 text-[0.9375rem] text-ink/80 transition-colors hover:text-forest",
                    "after:absolute after:inset-x-3.5 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-300 hover:after:scale-x-100",
                    isActive(item.href) && "text-forest after:scale-x-100",
                  )}
                >
                  {navLabels[item.href]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5">
          <button type="button" className={iconBtn} onClick={() => setSearchOpen(true)} aria-label={t("Common.search")}>
            <Search className="size-[1.15rem]" />
          </button>
          <Link href="/favorites" className={cn(iconBtn, "hidden sm:inline-flex")} aria-label={`${t("Common.favorites")} (${favorites.length})`}>
            <Heart className="size-[1.15rem]" />
            <Count n={favorites.length} />
          </Link>
          <Link href="/cart" className={iconBtn} aria-label={`${t("Common.cart")} (${cart.length})`}>
            <ShoppingBag className="size-[1.15rem]" />
            <Count n={cart.length} />
          </Link>
          <Link
            href="/sign-in"
            className="ml-2 hidden h-10 items-center rounded-sm border border-line-strong px-4 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-white md:inline-flex"
          >
            {t("Common.signIn")}
          </Link>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger className={cn(iconBtn, "lg:hidden")} aria-label={t("Common.menu")}>
              <Menu className="size-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-forest-deep/40" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(24rem,100%)] flex-col bg-ivory p-6 shadow-lift focus:outline-none">
                <div className="flex items-center justify-between">
                  <Dialog.Title asChild>
                    <span className="eyebrow">{t("Common.menu")}</span>
                  </Dialog.Title>
                  <Dialog.Close className={iconBtn} aria-label={t("Common.closeMenu")}>
                    <X className="size-5" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <nav aria-label="Mobile" className="mt-8">
                  <ul className="divide-y divide-line border-y border-line">
                    {primaryNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between py-4 font-display text-[1.625rem] text-forest"
                        >
                          {navLabels[item.href]}
                          <span aria-hidden className="text-clay">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                  <Link href="/favorites" onClick={() => setMenuOpen(false)} className="rounded-sm border border-line-strong px-4 py-3 text-forest">
                    {t("Common.favorites")} ({favorites.length})
                  </Link>
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="rounded-sm bg-forest px-4 py-3 text-center text-ivory">
                    {t("Common.signIn")}
                  </Link>
                </div>
                <p className="mt-auto pt-8 text-xs leading-relaxed text-muted">Woodworking & CNC is live. Quilting, leather, jewelry and ceramics are coming soon.</p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
