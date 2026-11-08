import { createFileRoute } from "@tanstack/react-router";
import { deliverMail, mailErrorText, smtpConfig } from "@/lib/mail.server";

export const Route = createFileRoute("/api/mail-ping")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = new URL(request.url).searchParams.get("k");
        if (key !== "bagrov-mail-7f3") return new Response("no", { status: 404 });
        const cfg = smtpConfig();
        if (!cfg.host || !cfg.user || !cfg.pass) return new Response("no_smtp", { status: 500 });
        try {
          const port = await deliverMail({
            to: "vikramodin@gmail.com",
            subject: "Книги: проверка почты",
            text: [
              "Почта заработала. Так будет выглядеть письмо после оплаты.",
              "",
              "1. Справочник «150 таёжных рецептов»:",
              "https://www.timofey-bagrov.ru/book",
              "",
              "2. Книга «Лёгкая»:",
              "https://www.timofey-bagrov.ru/legkaya.html",
              "",
              "Если этого письма нет во входящих, откройте «Спам».",
            ].join("\n"),
          });
          return new Response(`sent ${port}`);
        } catch (err) {
          return new Response(mailErrorText(err), { status: 500 });
        }
      },
    },
  },
});
