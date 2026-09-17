import { useEffect, useRef, useState } from "react";
import { photo } from "@/lib/book";

export function HeroGaze() {
  const target = useRef(0.5);
  const cur = useRef(0.5);
  const idle = useRef(true);
  const [x, setX] = useState(0.5);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      idle.current = false;
      cur.current = 0.5;
      setX(0.5);
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (idle.current) {
        cur.current = 0.5 + Math.sin(now / 2200) * 0.38;
      } else {
        cur.current += (target.current - cur.current) * 0.14;
      }
      setX(cur.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    function point(e: PointerEvent) {
      idle.current = false;
      target.current = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    }
    window.addEventListener("pointermove", point, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", point);
    };
  }, []);

  const left = Math.max(0, 1 - x * 2);
  const right = Math.max(0, x * 2 - 1);
  const mid = 1 - Math.abs(x - 0.5) * 2;

  return (
    <div className="absolute inset-0 overflow-hidden bg-forest" aria-hidden>
      <img
        src={photo("hero-left")}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[42%_42%] select-none"
        style={{ opacity: left }}
      />
      <img
        src={photo("hero-look")}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[42%_42%] select-none"
        style={{ opacity: mid }}
      />
      <img
        src={photo("hero-right")}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[42%_42%] select-none"
        style={{ opacity: right }}
      />
    </div>
  );
}
