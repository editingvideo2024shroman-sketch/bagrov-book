import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-cream px-3.5 font-sans text-sm text-ink placeholder:text-muted outline-none transition-shadow duration-(--motion-quick) focus-visible:ring-2 focus-visible:ring-clay/50",
        className,
      )}
      {...props}
    />
  );
}
