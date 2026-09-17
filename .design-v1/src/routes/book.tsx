import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Menu, X } from "lucide-react";
import { BuyDialog } from "@/components/buy-dialog";
import { RecipeBlock } from "@/components/recipe-block";
import { Button } from "@/components/ui/button";
import {
  SAMPLE_IDS,
  book,
  noteById,
  photo,
  recipeById,
  recipesIn,
  sectionOf,
} from "@/lib/book";
import { downloadBookFile } from "@/lib/download-book";
import { usePurchase } from "@/lib/purchase";
import { cn } from "@/lib/utils";

type Search = { r?: number; n?: number };

export const Route = createFileRoute("/book")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    r: num(raw.r),
    n: num(raw.n),
  }),
  component: BookPage,
});

function num(v: unknown) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function BookPage() {
  const { r, n } = Route.useSearch();
  const owned = usePurchase((s) => s.owned);
  const [tocOpen, setTocOpen] = useState(false);

  const recipe = r ? recipeById(r) : undefined;
  const note = n ? noteById(n) : undefined;
  const isSample = recipe ? (SAMPLE_IDS as readonly number[]).includes(recipe.id) : false;
  const locked = !owned && ((recipe && !isSample) || !!note || (!recipe && !note));

  const view =
    note ? "note" : recipe ? "recipe" : "home";

  return (
    <div className="min-h-svh bg-paper">
      <header className="no-print sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-paper/95 px-3 backdrop-blur sm:px-4">
        <button
          type="button"
          className="rounded-md p-2 hover:bg-paper-2 lg:hidden"
          aria-label="Оглавление"
          onClick={() => setTocOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <Link to="/" className="font-display text-lg leading-none">
          130 рецептов
        </Link>
        <span className="hidden font-sans text-sm text-muted sm:inline">
          / книга
        </span>
        <div className="ml-auto flex items-center gap-2">
          {owned ? (
            <>
              <Button size="sm" variant="outline" onClick={downloadBookFile}>
                <Download className="size-4" />
                Скачать
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/">На сайт</Link>
              </Button>
            </>
          ) : (
            <BuyDialog>
              <Button size="sm">Купить</Button>
            </BuyDialog>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="no-print hidden w-72 shrink-0 border-r border-line lg:block">
          <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-y-auto p-4">
            <Toc currentR={r} currentN={n} />
          </div>
        </aside>

        {tocOpen ? (
          <div className="no-print fixed inset-0 z-50 bg-paper lg:hidden">
            <div className="flex h-14 items-center justify-between border-b border-line px-3">
              <p className="font-display text-lg">Оглавление</p>
              <button
                type="button"
                className="rounded-md p-2 hover:bg-paper-2"
                aria-label="Закрыть"
                onClick={() => setTocOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="h-[calc(100svh-3.5rem)] overflow-y-auto p-4">
              <Toc
                currentR={r}
                currentN={n}
                onPick={() => setTocOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 sm:py-12">
          {view === "home" ? <BookHome locked={!owned} /> : null}
          {view === "recipe" && recipe ? (
            locked ? (
              <Gate title={recipe.title} />
            ) : (
              <RecipeView recipeId={recipe.id} owned={owned} />
            )
          ) : null}
          {view === "note" && note ? (
            locked ? (
              <Gate title={note.title} />
            ) : (
              <NoteView noteId={note.id} />
            )
          ) : null}
        </main>
      </div>
    </div>
  );
}

function BookHome({ locked }: { locked: boolean }) {
  return (
    <div className="mx-auto max-w-2xl">
      <img
        src={photo("cover")}
        alt=""
        className="mb-8 aspect-2/3 w-full max-w-sm rounded-lg object-cover shadow-book"
      />
      <p className="font-sans text-[0.72rem] tracking-[0.18em] text-clay uppercase">
        {book.author}
      </p>
      <h1 className="mt-2 font-display text-5xl">{book.title}</h1>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        130 рецептов из того, что всегда есть дома.
      </p>
      <p className="mt-4 font-serif text-base leading-relaxed text-muted">
        {book.disclaimer}
      </p>
      <div className="mt-8">
        {locked ? (
          <BuyDialog>
            <Button size="lg">Открыть все 130 рецептов</Button>
          </BuyDialog>
        ) : (
          <Button size="lg" asChild>
            <Link to="/book" search={{ r: 1 }}>
              Начать с первого рецепта
            </Link>
          </Button>
        )}
      </div>
      <p className="mt-4 font-sans text-sm text-muted">
        Без покупки открыты образцы: рецепты {SAMPLE_IDS.join(", ")}.
      </p>
    </div>
  );
}

function Gate({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-sans text-xs tracking-[0.16em] text-muted uppercase">
        Закрыто
      </p>
      <h1 className="mt-2 font-display text-3xl">{title}</h1>
      <p className="mt-3 font-serif text-ink-soft">
        Этот разворот открывается после покупки. Образцы — на главной.
      </p>
      <div className="mt-6">
        <BuyDialog>
          <Button size="lg">Купить книгу</Button>
        </BuyDialog>
      </div>
    </div>
  );
}

function RecipeView({ recipeId, owned }: { recipeId: number; owned: boolean }) {
  const recipe = recipeById(recipeId)!;
  const sec = sectionOf(recipe.section);
  const prev = recipeById(recipeId - 1);
  const next = recipeById(recipeId + 1);
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-sans text-xs tracking-[0.16em] text-muted uppercase">
        Раздел {sec.roman}. {sec.title}
      </p>
      <RecipeBlock recipe={recipe} />
      <Nav prev={prev} next={next} owned={owned} kind="recipe" />
    </div>
  );
}

function NoteView({ noteId }: { noteId: number }) {
  const note = noteById(noteId)!;
  const prev = noteById(noteId - 1);
  const next = noteById(noteId + 1);
  const paragraphs = note.body.split(/\n\n+/);
  return (
    <div className="mx-auto max-w-2xl">
      <img
        src={photo(note.image)}
        alt=""
        className="mb-8 aspect-16/9 w-full rounded-lg object-cover"
      />
      <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">
        Запись {note.id} из 6
      </p>
      <h1 className="mt-2 font-display text-4xl">{note.title}</h1>
      <div className="mt-8 space-y-5">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="font-serif text-lg leading-[1.65] text-ink-soft">
            {p}
          </p>
        ))}
      </div>
      <Nav prev={prev} next={next} owned kind="note" />
    </div>
  );
}

function Nav({
  prev,
  next,
  owned,
  kind,
}: {
  prev?: { id: number; title: string };
  next?: { id: number; title: string };
  owned: boolean;
  kind: "recipe" | "note";
}) {
  const search = (id: number) => (kind === "note" ? { n: id } : { r: id });
  return (
    <div className="no-print mt-10 flex items-stretch justify-between gap-3 border-t border-line pt-6">
      {prev ? (
        <Button variant="outline" className="h-auto min-h-11 max-w-[48%] py-2" asChild>
          <Link to="/book" search={search(prev.id)}>
            <ChevronLeft className="size-4 shrink-0" />
            <span className="truncate">{prev.title}</span>
          </Link>
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        owned || (kind === "recipe" && (SAMPLE_IDS as readonly number[]).includes(next.id)) ? (
          <Button variant="outline" className="h-auto min-h-11 max-w-[48%] py-2" asChild>
            <Link to="/book" search={search(next.id)}>
              <span className="truncate">{next.title}</span>
              <ChevronRight className="size-4 shrink-0" />
            </Link>
          </Button>
        ) : (
          <BuyDialog>
            <Button variant="outline" className="h-auto min-h-11">
              Дальше · купить
            </Button>
          </BuyDialog>
        )
      ) : kind === "recipe" ? (
        owned ? (
          <Button variant="outline" asChild>
            <Link to="/book" search={{ n: 1 }}>
              К разговору
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        ) : null
      ) : null}
    </div>
  );
}

function Toc({
  currentR,
  currentN,
  onPick,
}: {
  currentR?: number;
  currentN?: number;
  onPick?: () => void;
}) {
  const owned = usePurchase((s) => s.owned);
  return (
    <nav>
      <Link
        to="/book"
        className="block py-1 font-display text-lg text-ink"
        onClick={onPick}
      >
        Титул
      </Link>
      {book.sections.map((sec) => (
        <div key={sec.id} className="mt-4">
          <p className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase">
            {sec.roman}. {sec.short}
          </p>
          <ul className="mt-1">
            {recipesIn(sec.id).map((r) => {
              const open =
                owned || (SAMPLE_IDS as readonly number[]).includes(r.id);
              return (
                <li key={r.id}>
                  <Link
                    to="/book"
                    search={{ r: r.id }}
                    onClick={onPick}
                    className={cn(
                      "block truncate py-1 font-sans text-[13px] leading-snug",
                      currentR === r.id ? "text-clay" : "text-ink-soft hover:text-ink",
                      !open && "text-muted",
                    )}
                  >
                    {r.id}. {r.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-5">
        <p className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase">
          Разговор на важные темы
        </p>
        <ul className="mt-1">
          {book.notes.map((n) => (
            <li key={n.id}>
              <Link
                to="/book"
                search={{ n: n.id }}
                onClick={onPick}
                className={cn(
                  "block py-1 font-sans text-[13px]",
                  currentN === n.id ? "text-clay" : "text-ink-soft hover:text-ink",
                )}
              >
                {n.id}. {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
