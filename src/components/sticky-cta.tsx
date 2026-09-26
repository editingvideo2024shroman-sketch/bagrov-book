import { Link } from "@tanstack/react-router";
import { BuyDialog } from "@/components/buy-dialog";
import { Button } from "@/components/ui/button";
import { book } from "@/lib/book";
import { usePurchase } from "@/lib/purchase";
import { rub } from "@/lib/utils";

export function StickyCta() {
  const owned = usePurchase((s) => s.owned);

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="hidden font-sans text-sm text-ink sm:block">150 таёжных рецептов</p>
        {owned ? (
          <Button className="w-full sm:ml-auto sm:w-auto" asChild>
            <Link to="/book" search={{ r: 1 }}>
              Открыть справочник
            </Link>
          </Button>
        ) : (
          <BuyDialog source="sticky">
            <Button className="w-full sm:ml-auto sm:w-auto">
              Купить справочник — {rub(book.price)}
            </Button>
          </BuyDialog>
        )}
      </div>
    </div>
  );
}
