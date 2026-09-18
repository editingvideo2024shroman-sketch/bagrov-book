import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/" className="font-sans text-sm text-clay">
        ← На главную
      </Link>
      <h1 className="mt-6 font-display text-4xl tracking-tight">
        Политика конфиденциальности
      </h1>
      <div className="mt-6 space-y-4 font-serif text-base leading-relaxed text-ink-soft">
        <p>
          Оператором персональных данных является Шамин Роман Александрович
          (ИНН 741509611320).
        </p>
        <p>
          Для доставки электронной книги мы получаем имя и адрес электронной
          почты, которые вы указываете при заказе. Эти данные используются
          только чтобы открыть доступ к книге и ответить на обращение в
          поддержку.
        </p>
        <p>
          Мы не продаём данные третьим лицам и не используем их для рассылок
          без вашего согласия.
        </p>
        <p>
          Чтобы уточнить, изменить или удалить данные, напишите на{" "}
          <a className="text-clay" href="mailto:vikramodin@gmail.com">
            vikramodin@gmail.com
          </a>
          , позвоните{" "}
          <a className="text-clay" href="tel:+79517857698">
            +7 951 785-76-98
          </a>{" "}
          или в{" "}
          <a
            className="text-clay"
            href="https://t.me/MusicNPC_AI"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          .
        </p>
      </div>
    </main>
  );
}
