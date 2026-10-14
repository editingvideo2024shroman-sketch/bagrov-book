import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { goal } from "@/components/metrika";

export const Route = createFileRoute("/fail")({
  component: FailPage,
});

function FailPage() {
  useEffect(() => {
    goal("pay_fail");
  }, []);
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">Оплата</p>
      <h1 className="mt-2 font-display text-4xl">Платёж не прошёл</h1>
      <p className="mt-4 font-serif text-lg text-ink-soft">
        Деньги не списались или банк отменил операцию. Если деньги всё же ушли, откройте почту: ссылка на справочник приходит вместе с чеком. Можно попробовать ещё раз или написать менеджеру.
      </p>
      <a
        href="https://t.me/MusicNPC_AI"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => goal("manager")}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#229ED9] px-5 py-3 font-sans text-sm font-semibold text-white hover:bg-[#1b8dc4]"
      >
        Написать менеджеру в Telegram
      </a>
      <Link to="/" className="mt-4 font-sans text-sm font-semibold text-clay underline">
        Вернуться на сайт
      </Link>
    </main>
  );
}
