import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/offer")({
  component: OfferPage,
});

function OfferPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/" className="font-sans text-sm text-clay">
        ← На главную
      </Link>
      <h1 className="mt-6 font-display text-4xl tracking-tight">
        Публичная оферта
      </h1>
      <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-ink-soft">
        <p>
          Шамин Роман Александрович (ИНН 741509611320) предлагает купить электронную
          книгу «150 таёжных рецептов, которые работают» (авторский сборник
          Тимофея Багрова). Оплата на сайте — принятие этой оферты.
        </p>
        <p>
          Товар цифровой: доступ к книге на сайте и ссылка на скачивание на
          почту, указанную при заказе. Это не лекарство и не замена врача.
        </p>
        <p>
          Цена указана на сайте. Оплата разовая, без подписки. После оплаты
          доступ открывается сразу.
        </p>
        <h2 id="vozvrat" className="pt-4 font-display text-2xl text-ink">
          Возврат
        </h2>
        <p>
          Товар является цифровым. После отправки ссылки на скачивание возврат
          средств не осуществляется (согласно ст. 26.1 Закона РФ «О защите прав
          потребителей»).
        </p>
        <p>
          Если ссылка не пришла или файл не открывается — напишите в поддержку.
          Это не возврат товара, а помощь с доставкой.
        </p>
        <p>
          Оплачивая, вы подтверждаете, что ознакомились с офертой, политикой
          возврата и{" "}
          <Link to="/privacy" className="text-clay">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <p>
          Поддержка:{" "}
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
    </main>
  );
}
