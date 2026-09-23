import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Menu, X } from "lucide-react";
import { BuyDialog } from "@/components/buy-dialog";
import { RecipeBlock } from "@/components/recipe-block";
import { Button } from "@/components/ui/button";
import { SaveRecipe } from "@/components/save-recipe";
import {
  SAMPLE_IDS,
  book,
  noteById,
  photo,
  recipeById,
  recipesIn,
  sectionOf,
} from "@/lib/book";
import { confirmPayment } from "@/lib/pay.functions";
import { downloadBookFile } from "@/lib/download-book";
import { useFavorites } from "@/lib/favorites";
import { reachGoal } from "@/components/metrika";
import { usePurchase } from "@/lib/purchase";
import { cn } from "@/lib/utils";

type Search = {
  r?: number;
  n?: number;
  fav?: boolean;
  OutSum?: string;
  InvId?: string;
  SignatureValue?: string;
  Shp_email?: string;
};

export const Route = createFileRoute("/book")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    r: num(raw.r),
    n: num(raw.n),
    fav: raw.fav === true || raw.fav === "true" || raw.fav === "1" || raw.fav === 1,
    OutSum: text(raw.OutSum),
    InvId: text(raw.InvId),
    SignatureValue: text(raw.SignatureValue),
    Shp_email: text(raw.Shp_email),
  }),
  component: BookPage,
});

function num(v: unknown) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function text(v: unknown) {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function BookPage() {
  const { r, n, fav, OutSum, InvId, SignatureValue, Shp_email } = Route.useSearch();
  const owned = usePurchase((s) => s.owned);
  const buy = usePurchase((s) => s.buy);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search);
    const clean = (value?: string | null) => {
      const raw = (value ?? "").trim();
      if (raw.startsWith('"') && raw.endsWith('"')) {
        try {
          const parsed = JSON.parse(raw);
          if (typeof parsed === "string" || typeof parsed === "number") return String(parsed);
        } catch {
          return raw.slice(1, -1);
        }
      }
      return raw;
    };
    const outSum = clean(fromUrl.get("OutSum") || OutSum);
    const invId = clean(fromUrl.get("InvId") || InvId);
    const signature = clean(fromUrl.get("SignatureValue") || SignatureValue);
    const email = clean(fromUrl.get("Shp_email") || Shp_email);
    if (!outSum || !invId || !signature) return;
    void confirmPayment({
      data: { outSum, invId, signature, email },
    }).then((ok) => {
      if (!ok) return;
      const seen = `ym-pay-${invId}`;
      if (!sessionStorage.getItem(seen)) {
        sessionStorage.setItem(seen, "1");
        reachGoal("purchase");
      }
      buy({ email, name: "" });
      const next = new URL(window.location.href);
      next.search = "";
      window.history.replaceState(window.history.state, "", `${next.pathname}${next.hash}`);
    });
  }, [OutSum, InvId, SignatureValue, Shp_email, buy]);

  const recipe = r ? recipeById(r) : undefined;
  const note = n ? noteById(n) : undefined;
  const isSample = recipe ? (SAMPLE_IDS as readonly number[]).includes(recipe.id) : false;
  const locked = !owned && ((recipe && !isSample) || !!note || (!recipe && !note && !fav));

  const view = fav ? "fav" : note ? "note" : recipe ? "recipe" : "home";

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
          150 рецептов
        </Link>
        <span className="hidden font-sans text-sm text-muted sm:inline">
          / книга
        </span>
        <div className="ml-auto flex items-center gap-2">
          <BookHeaderActions />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="no-print hidden w-80 shrink-0 border-r border-line lg:block">
          <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-y-auto p-4">
            <Toc currentR={r} currentN={n} currentFav={!!fav} />
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
                currentFav={!!fav}
                onPick={() => setTocOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 sm:py-12">
          {view === "home" ? <BookHome locked={!owned} /> : null}
          {view === "fav" ? <FavoritesView owned={owned} /> : null}
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

function BookHeaderActions() {
  const owned = usePurchase((s) => s.owned);

  if (!owned) {
    return (
      <BuyDialog>
        <Button size="sm">Купить</Button>
      </BuyDialog>
    );
  }

  return (
    <>
      <DownloadBookButton />
      <Button size="sm" variant="outline" asChild>
        <Link to="/">На сайт</Link>
      </Button>
    </>
  );
}

function DownloadBookButton({ big = false }: { big?: boolean }) {
  const [packing, setPacking] = useState(false);

  async function onDownload() {
    if (packing) return;
    setPacking(true);
    try {
      await downloadBookFile();
    } catch {
      window.alert("Не получилось собрать книгу. Попробуйте ещё раз.");
    } finally {
      setPacking(false);
    }
  }

  return (
    <Button size={big ? "lg" : "sm"} onClick={() => void onDownload()} disabled={packing}>
      <Download className="size-4" />
      {packing ? "Собираю книгу…" : "Скачать книгу"}
    </Button>
  );
}

function BookHome({ locked }: { locked: boolean }) {
  return (
    <div className="mx-auto max-w-2xl">
      {locked ? null : (
        <div className="mb-8 rounded-lg border border-line bg-cream px-5 py-6">
          <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">Книга ваша</p>
          <h2 className="mt-2 font-display text-3xl">Сначала скачайте файл</h2>
          <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft">
            На почту приходит только чек об оплате, не сама книга. Нажмите кнопку ниже. Файл сохранится в телефоне и откроется без интернета. Читать можно и здесь.
          </p>
          <div className="mt-5">
            <DownloadBookButton big />
          </div>
        </div>
      )}
      <img
        src={photo("cover")}
        alt=""
        className="mb-8 aspect-2/3 w-full max-w-sm rounded-lg object-cover shadow-book"
      />
      <p className="font-sans text-[0.72rem] tracking-[0.18em] text-clay uppercase">
        {book.author}
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">{book.title}</h1>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        150 рецептов из того, что всегда есть дома.
      </p>
      <div className="mt-8">
        {locked ? (
          <BuyDialog>
            <Button size="lg">Открыть все 150 рецептов</Button>
          </BuyDialog>
        ) : (
          <Button size="lg" asChild>
            <Link to="/book" search={{ r: 1 }}>
              Начать с первого рецепта
            </Link>
          </Button>
        )}
      </div>
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
        Этот разворот открывается после покупки.
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
        Глава {sec.roman}. {sec.title}
      </p>
      <RecipeBlock recipe={recipe} saveable />
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
        {paragraphs.map((para) => (
          <p key={para.slice(0, 24)} className="font-serif text-lg leading-[1.65] text-ink-soft">
            {para}
          </p>
        ))}
      </div>
      <Nav prev={prev} next={next} owned kind="note" />
    </div>
  );
}

function FavoritesView({ owned }: { owned: boolean }) {
  const ids = useFavorites((s) => s.ids);
  const recipes = ids.map((id) => recipeById(id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">
        В книге
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Избранное</h1>
      {recipes.length === 0 ? (
        <p className="mt-6 font-serif text-lg text-ink-soft">
          Нажмите сердечко «В избранное» на рецепте — он появится здесь.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {recipes.map((r) => {
            const open =
              owned || (SAMPLE_IDS as readonly number[]).includes(r!.id);
            return (
              <li key={r!.id} className="flex items-center gap-3 py-3">
                <Link
                  to="/book"
                  search={{ r: r!.id }}
                  className="min-w-0 flex-1 font-display text-lg leading-snug hover:text-clay"
                >
                  <span className="font-sans text-sm text-muted">{r!.id}.</span>{" "}
                  {r!.title}
                  {!open ? (
                    <span className="ml-2 font-sans text-xs text-muted">закрыто</span>
                  ) : null}
                </Link>
                <SaveRecipe id={r!.id} />
              </li>
            );
          })}
        </ul>
      )}
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
  const nextOpen =
    !!next &&
    (owned || (kind === "recipe" && (SAMPLE_IDS as readonly number[]).includes(next.id)));

  return (
    <div className="no-print mt-10 grid grid-cols-2 items-stretch gap-3 border-t border-line pt-6">
      {prev ? (
        <Link
          to="/book"
          search={search(prev.id)}
          className="flex items-center gap-2 rounded-lg bg-clay px-3 py-3 font-sans text-sm font-semibold leading-snug text-cream hover:bg-clay-hover"
        >
          <ChevronLeft className="size-4 shrink-0" />
          Предыдущий рецепт
        </Link>
      ) : (
        <span />
      )}
      {nextOpen && next ? (
        <Link
          to="/book"
          search={search(next.id)}
          className="flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-3 text-left hover:border-clay"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-sm font-semibold text-clay">Далее</span>
            <span className="mt-1 block font-sans text-sm leading-snug text-ink">
              {next.title}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-clay" />
        </Link>
      ) : next && !nextOpen ? (
        <BuyDialog>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-line bg-cream px-3 py-3 text-left hover:border-clay"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-sans text-sm font-semibold text-clay">Далее</span>
              <span className="mt-1 block font-sans text-sm text-ink">купить книгу</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-clay" />
          </button>
        </BuyDialog>
      ) : kind === "recipe" && owned ? (
        <Link
          to="/book"
          search={{ n: 1 }}
          className="flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-3 text-left hover:border-clay"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-sm font-semibold text-clay">Далее</span>
            <span className="mt-1 block font-sans text-sm leading-snug text-ink">
              к разговору
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-clay" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

function Toc({
  currentR,
  currentN,
  currentFav,
  onPick,
}: {
  currentR?: number;
  currentN?: number;
  currentFav?: boolean;
  onPick?: () => void;
}) {
  const owned = usePurchase((s) => s.owned);
  const favCount = useFavorites((s) => s.ids.length);
  const recipe = currentR ? recipeById(currentR) : undefined;
  const currentSection = recipe?.section ?? (currentN ? "notes" : null);
  const [openId, setOpenId] = useState<string | null>(currentSection);

  useEffect(() => {
    if (currentSection) setOpenId(currentSection);
  }, [currentSection]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <nav>
      <Link
        to="/book"
        className="block py-1 font-display text-lg text-ink"
        onClick={onPick}
      >
        Титул
      </Link>
      <Link
        to="/book"
        search={{ fav: true }}
        onClick={onPick}
        className={cn(
          "mt-3 flex items-center gap-2 py-2 font-display text-[0.95rem]",
          currentFav ? "text-clay" : "text-ink hover:text-clay",
        )}
      >
        ♥ Избранное
        {favCount ? (
          <span className="font-sans text-xs text-muted">{favCount}</span>
        ) : null}
      </Link>
      {book.sections.map((sec) => {
        const open = openId === sec.id;
        const recipes = recipesIn(sec.id);
        const inThis = recipe?.section === sec.id;
        return (
          <div key={sec.id} className="mt-1 border-b border-line/70">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggle(sec.id)}
              className={cn(
                "flex w-full items-start gap-2 py-3 text-left",
                inThis ? "text-clay" : "text-ink hover:text-clay",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0 font-sans text-[11px] leading-none transition-transform duration-200",
                  open && "rotate-90",
                )}
                aria-hidden
              >
                ►
              </span>
              <span className="font-display text-[0.95rem] leading-snug">
                Глава {sec.roman}. {sec.title}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <ul className="pb-3">
                  {recipes.map((r) => {
                    const unlocked =
                      owned || (SAMPLE_IDS as readonly number[]).includes(r.id);
                    return (
                      <li key={r.id}>
                        <Link
                          to="/book"
                          search={{ r: r.id }}
                          onClick={onPick}
                          className={cn(
                            "grid grid-cols-[1.65rem_1fr] gap-x-1 py-1.5 pl-5 font-sans text-[12.5px] leading-snug",
                            currentR === r.id
                              ? "text-clay"
                              : "text-ink-soft hover:text-ink",
                            !unlocked && "text-muted",
                          )}
                        >
                          <span className="tabular-nums">{r.id}.</span>
                          <span>{r.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-1">
        <button
          type="button"
          aria-expanded={openId === "notes"}
          onClick={() => toggle("notes")}
          className={cn(
            "flex w-full items-start gap-2 py-3 text-left",
            currentN ? "text-clay" : "text-ink hover:text-clay",
          )}
        >
          <span
            className={cn(
              "mt-0.5 shrink-0 font-sans text-[11px] leading-none transition-transform duration-200",
              openId === "notes" && "rotate-90",
            )}
            aria-hidden
          >
            ►
          </span>
          <span className="font-display text-[0.95rem] leading-snug">
            Разговор на важные темы
          </span>
        </button>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
            openId === "notes" ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <ul className="pb-3">
              {book.notes.map((n) => (
                <li key={n.id}>
                  <Link
                    to="/book"
                    search={{ n: n.id }}
                    onClick={onPick}
                    className={cn(
                      "grid grid-cols-[1.65rem_1fr] gap-x-1 py-1.5 pl-5 font-sans text-[12.5px] leading-snug",
                      currentN === n.id
                        ? "text-clay"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className="tabular-nums">{n.id}.</span>
                    <span>{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
