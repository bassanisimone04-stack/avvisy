"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/ui";

type Ctx = { navigate: (href: string) => void; pending: boolean };
const Nav = createContext<Ctx>({ navigate: () => {}, pending: false });
export const useDirectoryNav = () => useContext(Nav).navigate;

/** Directory navigations (filters, sort, location) run in a transition; results show a skeleton meanwhile. */
export function DirectoryShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return <Nav.Provider value={{ pending, navigate: (href) => start(() => router.push(href, { scroll: false })) }}>{children}</Nav.Provider>;
}

export function PendingResults({ children, loadingLabel }: { children: ReactNode; loadingLabel: string }) {
  const { pending } = useContext(Nav);
  return (
    <div aria-busy={pending}>
      {pending ? (
        <div role="status">
          <span className="sr-only">{loadingLabel}</span>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <div key={i}><Skeleton className="aspect-[4/3] w-full" /><Skeleton className="mt-3 h-5 w-3/4" /><Skeleton className="mt-2 h-4 w-1/2" /></div>)}
          </div>
        </div>
      ) : children}
    </div>
  );
}
