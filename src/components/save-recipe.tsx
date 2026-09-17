import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function SaveRecipe({ id }: { id: number }) {
  const on = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={on}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-sm",
        on
          ? "border-clay bg-clay text-cream"
          : "border-line bg-cream text-ink-soft hover:border-clay hover:text-clay",
      )}
    >
      <Heart className={cn("size-4", on && "fill-current")} />
      {on ? "В избранном" : "В избранное"}
    </button>
  );
}
