import { cn } from "@/lib/utils";

export function BookCover({ className }: { className?: string }) {
  return (
    <figure className={cn("book-3d mx-auto w-full max-w-[340px]", className)}>
      <div className="book-3d-inner">
        <span className="book-3d-spine" aria-hidden />
        <span className="book-3d-pages" aria-hidden />
        <div className="book-3d-cover">
          <img
            src="/photos/cover.jpg?v=5"
            alt="Обложка книги Тимофея Багрова"
            className="h-full w-full object-cover object-[50%_18%]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent px-6 pt-20 pb-5">
            <p className="font-display text-[1.2rem] leading-[1.1] tracking-tight text-cream">
              130 домашних рецептов, которые работают
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
