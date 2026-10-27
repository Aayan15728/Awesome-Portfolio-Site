"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getOrCreateVisitorId } from "@/lib/fingerprint";

async function fetchCount(init?: RequestInit): Promise<number | null> {
  try {
    const res = await fetch("/api/visitors", init);
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // POST registers this browser and returns the count; fall back to a plain GET
    fetchCount({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: getOrCreateVisitorId() }),
    })
      .then((n) => n ?? fetchCount())
      .then((n) => {
        if (cancelled) return;
        setCount(n);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // storage unavailable: render nothing rather than a broken counter
  if (!loading && count === null) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/50 dark:bg-white/[0.03] text-xs text-muted">
      <Eye className="w-4 h-4 text-muted/60 flex-shrink-0" />
      {loading ? (
        <span className="animate-pulse text-muted/50">counting…</span>
      ) : (
        <span>
          You are the <strong className="text-foreground font-semibold">{count?.toLocaleString()}</strong>
          <sup>th</sup> visitor
        </span>
      )}
    </div>
  );
}
