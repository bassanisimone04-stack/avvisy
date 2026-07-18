import Link from "next/link";
import type { Category } from "@/lib/types";
import {
  IconBox,
  IconBolt,
  IconGear,
  IconRecycle,
  IconStore,
  IconTag,
  IconTruck,
  IconChart,
} from "./icons";

const iconFor: Record<string, typeof IconGear> = {
  "componenti-industriali": IconGear,
  ricambi: IconTag,
  "materiali-edili": IconStore,
  imballaggi: IconBox,
  "elettronica-professionale": IconBolt,
  attrezzature: IconChart,
  "arredi-aziendali": IconTruck,
  "materie-prime": IconRecycle,
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = iconFor[category.slug] ?? IconBox;
  return (
    <Link
      href={`/marketplace?categoria=${category.slug}`}
      className="card group flex items-center gap-4 p-4 transition-all hover:border-brand hover:shadow-[var(--shadow-soft)]"
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
        <Icon width={22} height={22} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">
          {category.name}
        </span>
        <span className="block text-xs text-muted">
          {category.count} lotti
        </span>
      </span>
    </Link>
  );
}
