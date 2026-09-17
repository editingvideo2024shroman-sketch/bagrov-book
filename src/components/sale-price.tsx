import { book } from "@/lib/book";
import { cn, rub } from "@/lib/utils";

export function SalePrice({
  className,
  size = "md",
  invert = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  invert?: boolean;
}) {
  const oldCls =
    size === "lg"
      ? "text-xl"
      : size === "sm"
        ? "text-xs"
        : "text-sm";
  const nowCls =
    size === "lg"
      ? "font-display text-6xl tracking-tight"
      : size === "sm"
        ? "font-display text-lg tracking-tight"
        : "font-display text-3xl tracking-tight";
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-0", className)}>
      <span
        className={cn(
          "font-sans line-through decoration-2",
          oldCls,
          invert ? "text-cream/40" : "text-muted",
        )}
      >
        {rub(book.listPrice)}
      </span>
      <span className={cn(nowCls, invert ? "text-cream" : "text-ink")}>
        {rub(book.price)}
      </span>
    </span>
  );
}
