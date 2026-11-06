import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Menu, X } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { plateById, plateChapters, plateRecipes, type PlateRecipe } from "@/data/plate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plate")({
  validateSearch: (raw: Record<string, unknown>): { r?: number; fav?: boolean } => {
    const search: { r?: number; fav?: boolean } = {};
    const n = typeof raw.r === "number" ? raw.r : typeof raw.r === "string" && raw.r ? Number(raw.r) : NaN;
    if (Number.isFinite(n)) search.r = n;
    if (raw.fav === true || raw.fav === "true" || raw.fav === "1") search.fav = true;
    return search;
  },
  head: () => ({
    meta: [{ title: "Лёгкая — 50 рецептов" }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: PlatePage,
});

type Fav = {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
};

const usePlateFav = create<Fav>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
    }),
    { name: "plate-favorites" },
  ),
);

const serif = '"Cormorant Garamond", Georgia, serif';
const sans = '"Manrope", ui-sans-serif, system-ui, sans-serif';

function PlatePage() {
  const navigate = useNavigate();
  const { r, fav } = Route.useSearch();
  const [toc, setToc] = useState(false);
  const recipe = r ? plateById(r) : undefined;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!recipe) return;
      if (e.key === "ArrowRight" && recipe.id < 50) {
        navigate({ to: "/plate", search: { r: recipe.id + 1 } });
      }
      if (e.key === "ArrowLeft" && recipe.id > 1) {
        navigate({ to: "/plate", search: { r: recipe.id - 1 } });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recipe, navigate]);

  return (
    <div className="min-h-svh" style={{ background: "#e4e1db", fontFamily: sans, color: "#1c1b19" }}>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 px-3 sm:px-5" style={{ background: "rgb(228 225 219 / 0.92)", backdropFilter: "blur(10px)" }}>
        <button type="button" className="rounded-full p-2 lg:hidden" aria-label="Оглавление" onClick={() => setToc(true)}>
          <Menu className="size-5" />
        </button>
        <Link to="/plate" className="text-[1.35rem] leading-none" style={{ fontFamily: serif }}>
          Лёгкая
        </Link>
        <span className="hidden text-xs tracking-[0.22em] text-[#7a756c] uppercase sm:inline">50 рецептов</span>
        <Link to="/" className="ml-auto text-xs tracking-wide text-[#7a756c]">
          На сайт
        </Link>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-y-auto px-5 py-8">
            <Toc current={recipe?.id} fav={!!fav} />
          </div>
        </aside>

        {toc ? (
          <div className="fixed inset-0 z-50 lg:hidden" style={{ background: "#e4e1db" }}>
            <div className="flex h-14 items-center justify-between px-3">
              <p className="text-2xl" style={{ fontFamily: serif }}>Оглавление</p>
              <button type="button" aria-label="Закрыть" onClick={() => setToc(false)} className="p-2">
                <X className="size-5" />
              </button>
            </div>
            <div className="h-[calc(100svh-3.5rem)] overflow-y-auto px-4 pb-10">
              <Toc current={recipe?.id} fav={!!fav} onPick={() => setToc(false)} />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-3 py-6 sm:px-8 sm:py-10">
          {fav ? <FavView /> : recipe ? <Sheet recipe={recipe} /> : <Title />}
        </main>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center">
      <img
        src="/photos/plate-cover.jpg"
        alt="Лёгкая. 50 рецептов правильного питания. Тимофей Багров"
        className="w-full rounded-sm shadow-[0_28px_70px_-28px_rgb(40_32_24/0.55)]"
      />
      <Link
        to="/plate"
        search={{ r: 1 }}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1c1b19] px-5 py-3 text-sm text-[#f6f3ee]"
      >
        Открыть книгу
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

function Sheet({ recipe }: { recipe: PlateRecipe }) {
  const saved = usePlateFav((s) => s.has(recipe.id));
  const toggle = usePlateFav((s) => s.toggle);
  const prev = plateById(recipe.id - 1);
  const next = plateById(recipe.id + 1);

  return (
    <div className="mx-auto w-full max-w-[680px]">
      <article className="px-6 py-8 sm:px-12 sm:py-12" style={paper}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] tracking-[0.32em] text-[#8a847a] uppercase">{recipe.kicker}</p>
          <button
            type="button"
            aria-label={saved ? "Убрать из избранного" : "В избранное"}
            onClick={() => toggle(recipe.id)}
            className="grid size-9 place-items-center rounded-full"
          >
            <Heart className={cn("size-5", saved ? "fill-[#8f3d4b] text-[#8f3d4b]" : "text-[#1c1b19]")} />
          </button>
        </div>
        <h1 className="mt-3 text-[2.6rem] leading-[0.95] sm:text-6xl" style={{ fontFamily: serif, fontWeight: 500 }}>
          {recipe.title}
        </h1>
        <p className="mt-4 text-sm tracking-wide text-[#6d675f]">
          примерно {recipe.kcal} ккал · белки {recipe.protein} · жиры {recipe.fat} · углеводы {recipe.carbs}
        </p>

        <img
          src={`/photos/plate-${String(recipe.id).padStart(2, "0")}.jpg`}
          alt={recipe.title}
          className="mt-8 aspect-4/3 w-full object-cover"
        />

        <p className="mt-8 text-center text-[11px] tracking-[0.28em] text-[#8a847a] uppercase">Состав</p>
        <p className="mt-3 text-center text-[1.2rem] leading-relaxed" style={{ fontFamily: serif }}>
          {recipe.ingredients.join("   ·   ")}
        </p>
        <div className="mt-6 h-px bg-[#e4ddd2]" />
        <p className="mt-6 text-center text-[11px] tracking-[0.28em] text-[#8a847a] uppercase">Как сделать</p>
        <ol className="mt-4 space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="w-5 shrink-0 text-[#8a847a]">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-right text-sm text-[#b7b0a6]" style={{ fontFamily: serif }}>
          {String(recipe.id).padStart(2, "0")}
        </p>
      </article>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            to="/plate"
            search={{ r: prev.id }}
            className="flex items-center justify-center gap-2 rounded-full bg-[#243028] px-3 py-3 text-sm font-medium text-[#f6f3ee]"
          >
            <ChevronLeft className="size-4" />
            Предыдущий рецепт
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/plate"
            search={{ r: next.id }}
            className="flex items-center gap-2 rounded-2xl border border-[#e4ddd2] bg-[#f7f4ef] px-4 py-3"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#8f3d4b]">Далее</span>
              <span className="mt-0.5 block text-sm leading-snug" style={{ fontFamily: serif, fontSize: "1.15rem" }}>
                {next.title}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 self-center text-[#8f3d4b]" />
          </Link>
        ) : (
          <Link to="/plate" className="flex items-center justify-center rounded-full border border-[#e4ddd2] px-3 py-3 text-sm">
            К началу
          </Link>
        )}
      </div>
    </div>
  );
}

function FavView() {
  const ids = usePlateFav((s) => s.ids);
  const recipes = ids.map((id) => plateById(id)).filter(Boolean) as PlateRecipe[];
  return (
    <article className="mx-auto w-full max-w-[640px] px-8 py-12" style={paper}>
      <p className="text-[11px] tracking-[0.32em] text-[#8a847a] uppercase">В книге</p>
      <h1 className="mt-2 text-5xl" style={{ fontFamily: serif, fontWeight: 500 }}>Избранное</h1>
      {recipes.length === 0 ? (
        <p className="mt-6 text-[#5c574f]">Сердечко на рецепте складывает его сюда. Это только на вашем телефоне.</p>
      ) : (
        <ul className="mt-8 divide-y divide-[#e4ddd2]">
          {recipes.map((r) => (
            <li key={r.id}>
              <Link to="/plate" search={{ r: r.id }} className="flex items-baseline gap-3 py-3">
                <span className="text-sm text-[#8a847a]">{String(r.id).padStart(2, "0")}</span>
                <span className="text-2xl" style={{ fontFamily: serif }}>{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Toc({ current, fav, onPick }: { current?: number; fav?: boolean; onPick?: () => void }) {
  const recipe = current ? plateById(current) : undefined;
  const [open, setOpen] = useState<string | null>(recipe?.chapter ?? "morning");
  const favCount = usePlateFav((s) => s.ids.length);

  useEffect(() => {
    if (recipe) setOpen(recipe.chapter);
  }, [recipe]);

  return (
    <nav>
      <Link to="/plate" onClick={onPick} className="block text-2xl" style={{ fontFamily: serif }}>
        Титул
      </Link>
      <Link
        to="/plate"
        search={{ fav: true }}
        onClick={onPick}
        className={cn("mt-4 flex items-center gap-2 text-sm", fav && "text-[#8f3d4b]")}
      >
        <Heart className="size-3.5" />
        Избранное
        {favCount ? <span className="text-[#8a847a]">{favCount}</span> : null}
      </Link>
      {plateChapters.map((ch) => {
        const items = plateRecipes.filter((r) => r.chapter === ch.id);
        const shown = open === ch.id;
        return (
          <div key={ch.id} className="mt-3 border-t border-[#d5cfc6] pt-2">
            <button type="button" className="flex w-full items-center gap-2 py-1 text-left" onClick={() => setOpen(shown ? null : ch.id)}>
              <span className="text-xs text-[#8a847a]">{shown ? "▼" : "►"}</span>
              <span className="text-lg leading-tight" style={{ fontFamily: serif }}>{ch.title}</span>
              <span className="ml-auto text-xs text-[#8a847a]">{ch.count}</span>
            </button>
            {shown ? (
              <ul className="pb-2">
                {items.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/plate"
                      search={{ r: r.id }}
                      onClick={onPick}
                      className={cn(
                        "block py-1 pl-5 text-sm leading-snug",
                        current === r.id ? "text-[#8f3d4b]" : "text-[#3c3934]",
                      )}
                    >
                      {String(r.id).padStart(2, "0")} {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

const paper: CSSProperties = {
  background: "#f7f4ee",
  boxShadow: "0 24px 60px -32px rgb(40 32 24 / 0.45)",
};
