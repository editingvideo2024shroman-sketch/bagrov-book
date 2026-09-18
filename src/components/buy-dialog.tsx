import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  const buy = usePurchase((s) => s.buy);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);
  const open = openProp ?? innerOpen;
  const setOpen = onOpenChange ?? setInnerOpen;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !agreed) return;
    setBusy(true);
    window.setTimeout(() => {
      buy({ email: email.trim(), name: name.trim() });
      setBusy(false);
      setOpen(false);
      void navigate({ to: "/book", search: { r: 1 } });
    }, 500);
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
        <DialogDescription>Имя и почта</DialogDescription>
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
            Понимаю: это не лечение. Если проблемы серьёзные — иду в больницу.
          </label>
          <SalePrice size="sm" className="mx-auto" />
          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={busy || !agreed}
          >
            {busy ? "Оплата…" : `Оплатить ${rub(book.price)}`}
          </Button>
          <p className="text-center font-sans text-[11px] leading-relaxed text-muted">
            Нажимая «Оплатить», вы принимаете{" "}
            <a href="/offer" className="underline underline-offset-2">
              оферту
            </a>
            . Товар цифровой: после отправки ссылки на скачивание возврат не
            осуществляется.
          </p>
          <p className="text-center text-[11px] leading-relaxed text-muted">
            Оплата на этой странице учебная: книга откроется сразу, чтобы вы
            видели макет. Боевой эквайринг подключим отдельно.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
