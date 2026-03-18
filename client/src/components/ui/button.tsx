import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl border text-sm font-semibold uppercase tracking-[0.08em] text-shadow-[0_1px_0_rgba(0,0,0,0.2)] transition-all duration-300 ease-out before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-70 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(255,45,45,0.28)] active:translate-y-[1px] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-[#ff6b6b]/35 bg-[linear-gradient(180deg,rgba(255,110,110,0.96)_0%,rgba(255,45,45,0.96)_55%,rgba(130,10,10,0.96)_100%)] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-8px_16px_rgba(120,0,0,0.35),0_12px_30px_rgba(0,0,0,0.35),0_0_26px_rgba(255,45,45,0.28)] hover:border-[#ff9f9f]/50 hover:bg-[linear-gradient(180deg,rgba(255,132,132,1)_0%,rgba(255,66,66,1)_58%,rgba(140,14,14,1)_100%)]",
        destructive:
          "border-red-400/30 bg-[linear-gradient(180deg,rgba(255,130,130,0.95)_0%,rgba(220,38,38,0.94)_55%,rgba(127,29,29,0.94)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_24px_rgba(0,0,0,0.35),0_0_18px_rgba(220,38,38,0.28)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.03)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-10px_18px_rgba(0,0,0,0.2),0_10px_22px_rgba(0,0,0,0.28)] hover:border-primary/45 hover:bg-[linear-gradient(180deg,rgba(255,80,80,0.18)_0%,rgba(255,255,255,0.05)_100%)] dark:bg-transparent dark:border-input dark:hover:bg-input/50",
        secondary:
          "border-white/12 bg-[linear-gradient(180deg,rgba(56,56,64,0.95)_0%,rgba(30,30,36,0.95)_100%)] text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.3)] hover:border-primary/30 hover:bg-[linear-gradient(180deg,rgba(78,44,44,0.96)_0%,rgba(32,20,20,0.96)_100%)]",
        ghost:
          "border-transparent bg-transparent text-white/85 shadow-none before:opacity-0 hover:border-white/10 hover:bg-white/6 hover:text-white dark:hover:bg-accent/50",
        link: "border-transparent bg-transparent p-0 text-primary shadow-none before:hidden hover:translate-y-0 hover:scale-100 hover:underline hover:shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-7 has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
