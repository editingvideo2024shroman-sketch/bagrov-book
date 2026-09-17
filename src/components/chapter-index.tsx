import { useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = {
  roman: string;
  title: string;
  blurb: string;
  count: string;
};

export function ChapterIndex({ chapters }: { chapters: Chapter[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
      <ol className="divide-y divide-line border-y border-line">
        {chapters.map((sec, i) => {
          const active = open === i;
          return (
            <li key={sec.roman}>
              <button
                type="button"
                onClick={() => setOpen(active ? -1 : i)}
                className={cn(
                  "flex w-full items-center gap-4 py-5 text-left transition-colors duration-200 sm:gap-6",
                  active ? "text-ink" : "text-ink/70 hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "font-display text-4xl leading-none transition-transform duration-300 sm:text-5xl",
                    active ? "scale-110 text-clay" : "text-clay/50",
                  )}
                >
                  {sec.roman}
                </span>
                <span className="flex-1 font-display text-xl leading-snug tracking-tight sm:text-2xl">
                  {sec.title}
                </span>
                <span
                  className={cn(
                    "font-display text-2xl text-clay transition-transform duration-200",
                    active && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 font-serif text-lg text-muted sm:pl-[4.5rem]">
                    {sec.blurb}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <div className="relative min-h-64 overflow-hidden rounded-xl bg-forest p-8 text-cream">
          {chapters.map((sec, i) => (
            <div
              key={sec.roman}
              className={cn(
                "absolute inset-0 flex flex-col justify-between p-8 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                open === i
                  ? "translate-x-0 opacity-100"
                  : open > i
                    ? "-translate-x-8 opacity-0"
                    : "translate-x-8 opacity-0",
              )}
            >
              <p className="kicker text-cream/50">Глава {sec.roman}</p>
              <div>
                <p className="font-display text-3xl leading-tight">{sec.title}</p>
                <p className="mt-4 font-serif text-cream/75">{sec.blurb}</p>
              </div>
              <p className="font-display text-xl text-clay">{sec.count}</p>
            </div>
          ))}
          {open < 0 ? (
            <p className="font-serif text-cream/70">
              Нажмите главу слева — откроется здесь.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
