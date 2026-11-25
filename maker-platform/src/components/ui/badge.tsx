import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] leading-5",
  {
    variants: {
      tone: {
        neutral: "bg-ivory-deep text-muted",
        forest: "bg-forest text-ivory",
        sage: "bg-sage-tint text-sage-ink",
        clay: "bg-clay-tint text-clay-ink",
        outline: "border border-line-strong text-muted",
        demo: "bg-[#FFF4D6] text-warning border border-[#EBD9A6]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({ className, tone, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/** Marks fictional content everywhere it appears. */
export function DemoBadge({ className, label = "Demo" }: { className?: string; label?: string }) {
  return (
    <Badge tone="demo" className={className} title="Fictional data used for interface development">
      {label}
    </Badge>
  );
}
