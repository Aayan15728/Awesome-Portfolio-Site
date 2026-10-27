"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface Thought {
  title: string;
  body: string;
}

export function Thoughts({ items }: { items: Thought[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
      {items.map((t, i) => {
        const isOpen = open === i;
        return (
          <div key={t.title}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-3.5 gap-4 text-left group"
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isOpen ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
                }`}
              >
                {t.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 text-muted/60 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-[13px] text-muted leading-relaxed">{t.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
