import { createFileRoute } from "@tanstack/react-router";
import { deliverMail, mailErrorText, smtpConfig } from "@/lib/mail.server";

export const Route = createFileRoute("/api/mail-ping")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = new URL(request.url).searchParams.get("k");
        if (key !== "bagrov-mail-7f3") return new Response("no", { status: 404 });
        const cfg = smtpConfig();
        const info = `host=${cfg.host || "empty"} port=${cfg.port} user=${cfg.user ? "set" : "empty"} pass=${cfg.pass ? "set" : "empty"} from=${cfg.from || "empty"}`;
        if (!cfg.host || !cfg.user || !cfg.pass) return new Response(info, { status: 500 });
        try {
          const port = await deliverMail({
            to: "vikramodin@gmail.com",
            subject: "Проверка: книга уходит на почту",
            text: "Если это письмо пришло, отправка с сайта работает.",
          });
          return new Response(`sent port=${port} ${info}`);
        } catch (err) {
          return new Response(`${info}\n${mailErrorText(err)}`, { status: 500 });
        }
      },
    },
  },
});
