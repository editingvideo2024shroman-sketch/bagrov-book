import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { goal } from "@/components/metrika";
import { Button } from "@/components/ui/button";
import { downloadBookFile } from "@/lib/download-book";
import { confirmPayment } from "@/lib/pay.functions";
import { usePurchase } from "@/lib/purchase";

type Search = {
  OutSum?: string;
  InvId?: string;
  SignatureValue?: string;
  Shp_email?: string;
};

export const Route = createFileRoute("/success")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    OutSum: text(raw.OutSum),
    InvId: text(raw.InvId),
    SignatureValue: text(raw.SignatureValue),
    Shp_email: text(raw.Shp_email),
  }),
  server: {
    handlers: {
      POST: async ({ request }) => bounce(request),
    },
  },
  component: SuccessPage,
});

function text(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function bounce(request: Request) {
  const params = new URLSearchParams(await request.text());
  const dest = new URL("/success", new URL(request.url).origin);
  for (const key of ["OutSum", "InvId", "SignatureValue", "Shp_email"]) {
    const value = params.get(key);
    if (value) dest.searchParams.set(key, value);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: `${dest.pathname}${dest.search}` },
  });
}

function SuccessPage() {
  const search = Route.useSearch();
  const buy = usePurchase((s) => s.buy);
  const [state, setState] = useState<"wait" | "ok" | "bad">(
    search.OutSum && search.InvId && search.SignatureValue ? "wait" : "bad",
  );
  const [packing, setPacking] = useState(false);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search);
    const outSum = fromUrl.get("OutSum") || search.OutSum || "";
    const invId = fromUrl.get("InvId") || search.InvId || "";
    const signature = fromUrl.get("SignatureValue") || search.SignatureValue || "";
    const email = fromUrl.get("Shp_email") || search.Shp_email || "";
    if (!outSum || !invId || !signature) {
      setState("bad");
      return;
    }
    const mark = `bagrov-paid-${invId}`;
    if (sessionStorage.getItem(mark) === "ok") {
      buy({ email, name: "" });
      setState("ok");
      return;
    }
    void confirmPayment({ data: { outSum, invId, signature, email } }).then((ok) => {
      if (!ok) {
        setState("bad");
        return;
      }
      sessionStorage.setItem(mark, "ok");
      goal("paid");
      buy({ email, name: "" });
      setState("ok");
    });
  }, [search.OutSum, search.InvId, search.SignatureValue, search.Shp_email, buy]);

  async function downloadHandbook() {
    if (packing) return;
    setPacking(true);
    try {
      await downloadBookFile();
    } catch {
      window.alert("Не получилось собрать справочник. Попробуйте ещё раз.");
    } finally {
      setPacking(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">Оплата</p>
      {state === "wait" ? (
        <>
          <h1 className="mt-2 font-display text-4xl">Проверяю оплату</h1>
          <p className="mt-4 font-serif text-lg text-ink-soft">Секунду. Сейчас откроются кнопки скачивания.</p>
        </>
      ) : null}
      {state === "ok" ? (
        <>
          <h1 className="mt-2 font-display text-4xl">Оплата прошла</h1>
          <p className="mt-4 font-serif text-lg text-ink-soft">
            Обе книги можно скачать сейчас. Ссылки продублируем на почту. Если письма нет во входящих, загляните в «Спам».
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" onClick={() => void downloadHandbook()} disabled={packing}>
              <Download className="size-4" />
              {packing ? "Собираю справочник…" : "Скачать справочник"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/legkaya.html" download="50-receptov-pp.html">
                <Download className="size-4" />
                Скачать книгу «50 рецептов ПП»
              </a>
            </Button>
            <Button size="lg" variant="forest" asChild>
              <Link to="/book">Открыть справочник</Link>
            </Button>
          </div>
          <p className="mt-4 font-sans text-sm text-muted">
            Справочник собирается около минуты: в файл входят все фото. Страницу не закрывайте.
          </p>
        </>
      ) : null}
      {state === "bad" ? (
        <>
          <h1 className="mt-2 font-display text-4xl">Ссылка не подтвердилась</h1>
          <p className="mt-4 font-serif text-lg text-ink-soft">
            Если деньги уже списались, обе книги придут на почту. Если письма нет и во «Спаме» тоже — напишите, отправим вручную.
          </p>
          <a
            href="https://t.me/MusicNPC_AI"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => goal("manager")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#229ED9] px-5 py-3 font-sans text-sm font-semibold text-white hover:bg-[#1b8dc4]"
          >
            Написать в Telegram
          </a>
        </>
      ) : null}
      <Link to="/" className="mt-6 font-sans text-sm font-semibold text-clay underline">
        Вернуться на сайт
      </Link>
    </main>
  );
}
