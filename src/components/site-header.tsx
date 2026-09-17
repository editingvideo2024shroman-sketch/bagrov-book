import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "@/components/buy-dialog";
import { usePurchase } from "@/lib/purchase";

export function SiteHeader() {
  const owned = usePurchase((s) => s.owned);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:h-14 sm:gap-3 sm:px-6 sm:py-0">
        <nav className="flex min-w-0 items-center gap-2.5 overflow-x-auto whitespace-nowrap font-sans text-[0.72rem] text-muted sm:gap-5 sm:text-sm">
          <a href="#toc" className="hover:text-ink">
            Оглавление
          </a>
          <a href="#sample" className="hover:text-ink">
            Внутри
          </a>
          <a href="#author" className="hover:text-ink">
            Автор
          </a>
        </nav>
        {owned ? (
          <Button size="sm" asChild>
            <Link to="/book" search={{ r: 1 }}>
              Открыть книгу
            </Link>
          </Button>
        ) : (
          <BuyDialog>
            <Button size="sm">Забрать книгу</Button>
          </BuyDialog>
        )}
      </div>
    </header>
  );
}
