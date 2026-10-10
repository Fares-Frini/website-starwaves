import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * The site's buttons, shadcn-style (`cva` + Radix `Slot`), in the few variants
 * the pages need — two for the night sections, two for the light ones.
 *
 * - `nova`: the main action on dark. A starlit pill that picks up a blue glow
 *   when pointed at — the one bright object in the sky.
 * - `orbit`: the second action on dark, an outline.
 * - `solid` / `outline`: the same pair for light sections.
 *
 * `asChild` renders the styles onto a link instead of a `<button>`, which is
 * what almost every call here is: these lead somewhere.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--dur-fast)] ease-[var(--ease-standard)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        nova: "bg-starlight text-space-950 hover:shadow-glow-blue",
        orbit:
          "border border-space-line-strong text-starlight hover:border-nova-blue/60 hover:bg-white/5",
        solid: "bg-brand-600 text-white shadow-card hover:bg-brand-700",
        outline:
          "border border-line-strong bg-surface text-ink hover:bg-surface-hover",
        ghost: "text-starlight-muted hover:bg-white/5 hover:text-starlight",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "nova", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : "button";
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
