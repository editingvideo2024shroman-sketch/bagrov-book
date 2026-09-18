import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/offer")({
  component: OfferPage,
});

function OfferPage() {
  return (
    <main className="min-h-svh bg-paper px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-cream px-5 py-8 sm:px-8">
        <Link to="/" className="font-sans text-sm text-clay">
          ← На главную
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Оферта</h1>
        <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-ink-soft">
          <p>
            Шамин Роман Александрович (ИНН 741509611320) предлагает купить
            электронную книгу «150 таёжных рецептов, которые работают»
            (авторский сборник Тимофея Багрова). Оплата на сайте — принятие
            этой оферты.
          </p>
          <p>
            Товар цифровой: доступ к книге на сайте и ссылка на скачивание на
            почту, указанную при заказе. Это не лекарство и не замена врача.
          </p>
          <p>
            Цена указана на сайте. Оплата разовая, без подписки. После оплаты
            доступ открывается сразу.
          </p>
          <p>
            Оплачивая, вы подтверждаете, что ознакомились с этой офертой и
            политикой конфиденциальности.
          </p>
        </div>
      </div>
    </main>
  );
}
