import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="GlutenFree Directory, torna alla home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
        <Leaf size={19} strokeWidth={2.2} />
      </span>
      <span className="font-display text-lg font-bold leading-none text-ink">
        GlutenFree<span className="text-brand"> Directory</span>
      </span>
    </Link>
  );
}
