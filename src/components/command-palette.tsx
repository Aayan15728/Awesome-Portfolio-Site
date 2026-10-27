"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowUpRight, CornerDownLeft, Link2, Moon, Search, Sun } from "lucide-react";
import { NAV } from "@/lib/nav";
import { siteConfig } from "@/lib/site";
import { centerOf, switchTheme } from "@/lib/theme-transition";

export const OPEN_PALETTE_EVENT = "open-command-palette";

const itemClass =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 cursor-pointer select-none " +
  "data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10 data-[selected=true]:text-foreground";

const headingClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 " +
  "[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const external = [
    { label: "GitHub", href: siteConfig.social.github },
    { label: "X (Twitter)", href: siteConfig.social.x },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "Email", href: siteConfig.social.email },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      overlayClassName="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[18vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-background shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-dashed border-neutral-300/80 dark:border-neutral-700/80 px-4">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <Command.Input
          placeholder="Search for pages or actions…"
          className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted/70 outline-none"
        />
      </div>

      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-muted">No results found.</Command.Empty>

        <Command.Group heading="Navigation" className={headingClass}>
          {NAV.map((item) => (
            <Command.Item
              key={item.href}
              value={`${item.label} ${item.hint}`}
              onSelect={() => run(() => router.push(item.href))}
              className={itemClass}
            >
              <span className="flex-1">{item.label}</span>
              <span className="text-xs text-muted hidden sm:block">{item.hint}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Links" className={headingClass}>
          {external.map((link) => (
            <Command.Item
              key={link.label}
              value={link.label}
              onSelect={() => run(() => window.open(link.href, "_blank", "noopener,noreferrer"))}
              className={itemClass}
            >
              <span className="flex-1">{link.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="General" className={headingClass}>
          <Command.Item
            value="Copy link"
            onSelect={() => run(() => void navigator.clipboard?.writeText(window.location.href))}
            className={itemClass}
          >
            <Link2 className="w-4 h-4" />
            <span className="flex-1">Copy link</span>
          </Command.Item>
          <Command.Item
            value="Toggle theme dark light"
            onSelect={() =>
              run(() =>
                // wait a frame so the closed palette isn't captured in the transition snapshot
                requestAnimationFrame(() =>
                  switchTheme(
                    resolvedTheme === "dark" ? "light" : "dark",
                    setTheme,
                    centerOf(document.querySelector('[aria-label="Toggle theme"]'))
                  )
                )
              )
            }
            className={itemClass}
          >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="flex-1">Toggle theme</span>
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="flex items-center justify-between border-t border-dashed border-neutral-300/80 dark:border-neutral-700/80 px-4 py-2 text-[11px] text-muted">
        <span>Navigate with ↑ ↓</span>
        <span className="inline-flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" /> to select
        </span>
      </div>
    </Command.Dialog>
  );
}
