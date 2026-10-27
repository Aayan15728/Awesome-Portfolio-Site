"use client";

import { Command } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/command-palette";
import { cn } from "@/lib/utils";

/** Small "⌘ K" badge that opens the command palette. */
export function CommandTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="Open command palette"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-black/[0.06] dark:border-white/10 bg-white dark:bg-white/5",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-2 py-1 text-[11px] text-muted",
        "hover:text-foreground transition-colors duration-200 active:scale-95",
        className
      )}
    >
      <Command className="w-3 h-3" />
      <span>K</span>
    </button>
  );
}
