import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  as: As = "h2",
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <As className="text-display-md text-balance">{title}</As>
        {lede ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted text-pretty">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
