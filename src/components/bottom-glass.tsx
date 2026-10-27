"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fixed bottom band that frosts content scrolling underneath it (styles in globals.css).
 * It fades out while the footer wordmark is on screen, so the wordmark stays crisp.
 */
export function BottomGlass() {
  const ref = useRef<HTMLDivElement>(null);
  // every page renders its own footer: re-attach after client-side navigation
  const pathname = usePathname();

  useEffect(() => {
    const target = document.querySelector("[data-footer-wordmark]");
    const band = ref.current;
    if (!target || !band || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => band.classList.toggle("is-hidden", entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
      band.classList.remove("is-hidden");
    };
  }, [pathname]);

  return (
    <div ref={ref} className="bottom-glass" aria-hidden>
      <i />
      <i />
      <i />
    </div>
  );
}
