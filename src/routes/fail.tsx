import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/fail")({
  component: FailPage,
});

function FailPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">Оплата</p>
      <h1 className="mt-2 font-display text-4xl">Платёж не прошёл</h1>
      <p className="mt-4 font-serif text-lg text-ink-soft">
        Деньги не списались или банк отменил операцию. Книга не открылась. Можно попробовать ещё раз.
      </p>
      <Link to="/" className="mt-8 font-sans text-sm font-semibold text-clay underline">
        Вернуться на сайт
      </Link>
    </main>
  );
}
