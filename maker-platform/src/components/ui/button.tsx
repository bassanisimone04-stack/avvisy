import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui-style button, restyled to the design system. */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-forest text-ivory hover:bg-forest-deep shadow-[inset_0_-1px_0_rgb(0_0_0/0.18)]",
        clay: "bg-clay-ink text-white hover:bg-[#82462a]",
        outline: "border border-line-strong bg-white/60 text-forest hover:border-forest hover:bg-white",
        ghost: "text-forest hover:bg-forest/[0.06]",
        light: "bg-ivory text-forest hover:bg-white",
        link: "text-clay-ink underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-9 px-3.5 text-sm rounded-sm",
        md: "h-11 px-5 text-[0.9375rem] rounded-sm",
        lg: "h-13 px-6 text-base rounded-md",
        icon: "size-10 rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
