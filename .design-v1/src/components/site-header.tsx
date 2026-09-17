import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "@/components/buy-dialog";
import { usePurchase } from "@/lib/purchase";
import { rub } from "@/lib/utils";
import { book } from "@/lib/book";

export function SiteHeader() {
  const owned = usePurchase((s) => s.owned);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-[1.15rem] leading-none tracking-tight"
        >
          130 рецептов
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a
            href="#toc"
            className="hidden text-sm text-muted hover:text-ink sm:inline"
          >
            Оглавление
          </a>
          {owned ? (
            <Button size="sm" asChild>
              <Link to="/book" search={{ r: 1 }}>
                Открыть книгу
              </Link>
            </Button>
          ) : (
            <BuyDialog>
              <Button size="sm">Купить · {rub(book.price)}</Button>
            </BuyDialog>
          )}
        </nav>
      </div>
    </header>
  );
}
