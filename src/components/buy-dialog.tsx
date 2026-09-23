import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { book } from "@/lib/book";
import { startPayment } from "@/lib/pay.functions";
import { usePurchase } from "@/lib/purchase";
import { rub } from "@/lib/utils";
import { SalePrice } from "@/components/sale-price";

export function BuyDialog({
  children,
  open: openProp,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const owned = usePurchase((s) => s.owned);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const open = openProp ?? innerOpen;
  const setOpen = onOpenChange ?? setInnerOpen;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !agreed || busy) return;
    setBusy(true);
    setError("");
    try {
      const payment = await startPayment({ data: { email: email.trim() } });
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payment.action;
      form.acceptCharset = "utf-8";
      for (const [key, value] of Object.entries(payment.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      setBusy(false);
      setError("Не удалось открыть оплату. Напишите в Telegram, оформим вручную.");
    }
  }

  if (owned && children) {
    return (
      <Button asChild>
        <a href="/book?r=1">Открыть книгу</a>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogTitle>Купить книгу с рецептами от Тимофея</DialogTitle>
        <DialogDescription>
          Один платёж, без подписок.
          <br />
          Книга откроется сразу.
          <br />
          Сохраните её кнопкой «Скачать книгу».
          <br />
          На почту придёт чек.
        </DialogDescription>
        <form className="mt-5 flex flex-col gap-3.5" onSubmit={submit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="buy-name">Имя</Label>
            <Input
              id="buy-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Как к вам обращаться"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="buy-email">Почта</Label>
            <Input
              id="buy-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@mail.ru"
            />
          </div>
          <label className="flex items-start gap-2.5 font-sans text-sm leading-snug text-ink-soft">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-forest"
            />
            После оплаты нажмите «Вернуться в магазин».
          </label>
          <SalePrice size="sm" className="mx-auto" />
          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={busy || !agreed}
          >
            {busy ? "Переходим к оплате…" : `Оплатить ${rub(book.price)}`}
          </Button>
          {error ? <p className="text-center font-sans text-sm text-clay">{error}</p> : null}
          <p className="text-center font-sans text-[11px] leading-relaxed text-muted">
            Нажимая «Оплатить», вы принимаете{" "}
            <a href="/offer" className="underline underline-offset-2">
              оферту
            </a>
            . Товар цифровой: после оплаты возврат не осуществляется. На почту
            придёт только чек.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
