"use client";

import { useSyncExternalStore } from "react";

// ticks every 15s; the snapshot is the current minute so React only re-renders when the clock changes
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

function relative(fromMs: number, nowMs: number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutes = Math.round((fromMs - nowMs) / 60_000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  return rtf.format(Math.round(days / 30), "month");
}

interface FooterLiveProps {
  place: string;
  timeZone: string;
  lastPushAt: string | null;
  githubUrl: string;
}

/** "It's 6:40 PM in India · Last shipped 2 days ago": rendered on the client so it's always current. */
export function FooterLive({ place, timeZone, lastPushAt, githubUrl }: FooterLiveProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);

  // server render / first paint: reserve the line's space without guessing the time
  if (minute === null) return <p className="h-5" aria-hidden />;

  const now = minute * 60_000;
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(now);

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
      <span>
        It&apos;s <span className="font-medium text-foreground tabular-nums">{time}</span> in {place}
      </span>
      {lastPushAt && (
        <>
          <span aria-hidden className="text-muted/50">
            &middot;
          </span>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Last shipped {relative(new Date(lastPushAt).getTime(), now)}
          </a>
        </>
      )}
    </p>
  );
}
