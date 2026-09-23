import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export const METRIKA_ID = 112969256;

type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };

function ym(): Ym | undefined {
  return (window as Window & { ym?: Ym }).ym;
}

export function Metrika() {
  const href = useRouterState({
    select: (s) => s.location.href,
  });

  useEffect(() => {
    const w = window as Window & { ym?: Ym };
    if (w.ym) return;
    const queue = function (...args: unknown[]) {
      (queue.a = queue.a || []).push(args);
    } as Ym;
    queue.l = Date.now();
    w.ym = queue;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    document.head.appendChild(script);
    w.ym(METRIKA_ID, "init", {
      defer: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    });
  }, []);

  useEffect(() => {
    ym()?.(METRIKA_ID, "hit", window.location.href);
  }, [href]);

  return null;
}
