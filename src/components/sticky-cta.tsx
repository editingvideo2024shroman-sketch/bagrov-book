import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BuyDialog } from "@/components/buy-dialog";
import { Button } from "@/components/ui/button";
import { book } from "@/lib/book";
import { usePurchase } from "@/lib/purchase";
import { rub } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SalePrice } from "@/components/sale-price";

export function StickyCta() {
  const owned = usePurchase((s) => s.owned);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > window.innerHeight * 0.7);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] sm:px-6",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="hidden items-baseline gap-2 sm:flex">
          <span className="font-display text-sm tracking-tight">150 рецептов</span>
          <SalePrice size="sm" />
        </p>
        {owned ? (
          <Button className="ml-auto" asChild>
            <Link to="/book" search={{ r: 1 }}>
              Открыть книгу
            </Link>
          </Button>
        ) : (
          <BuyDialog>
            <Button className="ml-auto">Купить · {rub(book.price)}</Button>
          </BuyDialog>
        )}
      </div>
    </div>
  );
}
