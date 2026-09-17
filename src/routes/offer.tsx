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
          Настоящий документ — публичная оферта Шамина Романа Александровича
          (ИНН 222222) о продаже электронной книги «150 таёжных рецептов,
          которые работают» (авторский сборник Тимофея Багрова).
        </p>
        <p>
          Предмет: доступ к электронной книге с рецептами. Это не лекарство, не
          медицинская услуга и не замена консультации врача.
        </p>
        <p>
          Цена указана на сайте. Оплата — разовая. После оплаты доступ
          открывается сразу, книгу можно читать и скачать.
        </p>
        <p>
          Оплачивая заказ, вы подтверждаете, что ознакомились с описанием
          товара, политикой конфиденциальности и этим документом.
        </p>
        <p>
          По вопросам заказа:{" "}
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
