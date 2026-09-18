import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
});

function RefundPage() {
  return (
    <main className="min-h-svh bg-paper px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-cream px-5 py-8 sm:px-8">
        <Link to="/" className="font-sans text-sm text-clay">
          ← На главную
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Возврат</h1>
        <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-ink-soft">
          <p>
            Товар является цифровым. После отправки ссылки на скачивание возврат
            средств не осуществляется (согласно ст. 26.1 Закона РФ «О защите
            прав потребителей»).
          </p>
          <p>
            Если ссылка не пришла или файл не открывается — напишите в
            поддержку. Это не возврат товара, а помощь с доставкой.
          </p>
          <p>
            Поддержка:{" "}
            <a className="text-clay" href="tel:+79517857698">
              +7 951 785-76-98
            </a>
            ,{" "}
            <a className="text-clay" href="mailto:vikramodin@gmail.com">
              vikramodin@gmail.com
            </a>
            , Telegram{" "}
            <a
              className="text-clay"
              href="https://t.me/MusicNPC_AI"
              target="_blank"
              rel="noreferrer"
            >
              @MusicNPC_AI
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
