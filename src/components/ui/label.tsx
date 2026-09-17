import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-sans text-xs font-medium tracking-wide text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
