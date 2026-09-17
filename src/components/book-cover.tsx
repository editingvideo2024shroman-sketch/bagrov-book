import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export function BookCover({ className }: { className?: string }) {
  const inner = useRef<HTMLDivElement>(null);

  function move(e: PointerEvent<HTMLElement>) {
    const el = inner.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${-20 + x * 10}deg) rotateX(${6 - y * 6}deg)`;
  }

  function leave() {
    const el = inner.current;
    if (!el) return;
    el.style.transform = "rotateY(-20deg) rotateX(6deg)";
  }

  return (
    <figure
      className={cn("book-3d mx-auto w-full max-w-[340px]", className)}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div ref={inner} className="book-3d-inner book-3d-live">
        <span className="book-3d-spine" aria-hidden />
        <span className="book-3d-pages" aria-hidden />
        <div className="book-3d-cover">
          <img
            src="/photos/cover.jpg?v=5"
            alt="Обложка книги Тимофея Багрова"
            className="pointer-events-none h-full w-full object-cover object-[50%_18%]"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent px-6 pt-20 pb-5">
            <p className="font-display text-[1.2rem] leading-[1.1] tracking-tight text-cream">
              150 таёжных рецептов, которые работают
            </p>
            <p className="mt-2 font-sans text-[0.68rem] tracking-[0.18em] text-cream/70 uppercase">
              Тимофей Багров
            </p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
