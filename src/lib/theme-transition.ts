import { flushSync } from "react-dom";

type Theme = "light" | "dark";

/**
 * Switches theme with a circular reveal that grows from `origin` (usually the toggle button),
 * using the View Transitions API. Falls back to an instant switch when the browser lacks the API
 * or the user prefers reduced motion.
 */
export function switchTheme(next: Theme, setTheme: (theme: Theme) => void, origin?: { x: number; y: number }) {
  const apply = () => {
    setTheme(next);
    // next-themes applies the class in an effect; set it now so the "after" snapshot is already themed
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof document.startViewTransition !== "function" || reduceMotion) {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? window.innerHeight - 40;
  // radius that reaches the farthest corner of the viewport
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(() => flushSync(apply));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {
      /* transition skipped (e.g. tab hidden): theme is already applied */
    });
}

/** Centre of an element, used as the reveal origin. */
export function centerOf(el: Element | null): { x: number; y: number } | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
