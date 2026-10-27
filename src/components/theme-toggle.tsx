"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { centerOf, switchTheme } from "@/lib/theme-transition";

const box =
  "w-9 h-9 flex items-center justify-center rounded-lg border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-900/60";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className={cn(box, "opacity-0", className)} />;
  }

  return (
    <button
      onClick={(e) => switchTheme(resolvedTheme === "dark" ? "light" : "dark", setTheme, centerOf(e.currentTarget))}
      className={cn(
        "relative transition-all duration-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 active:scale-95",
        box,
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-foreground/80" />
      <Moon className="absolute h-4 w-4 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-foreground/80" />
    </button>
  );
}
