"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { FaSpotify } from "react-icons/fa6";
import { toggleTrack, useTrack } from "@/lib/player";
import { cn } from "@/lib/utils";

export interface MusicCardProps {
  title: string;
  artist: string;
  artworkUrl: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
  label?: string;
}

function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="inline-flex h-2.5 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("w-[2px] rounded-full bg-emerald-500", active ? "eq-bar h-full" : "h-1 opacity-60")}
        />
      ))}
    </span>
  );
}

/** Site-styled "on repeat" card: album art, title, play/pause for a 30s preview and a thin progress line. */
export function MusicCard({ title, artist, artworkUrl, previewUrl, spotifyUrl, label = "On repeat" }: MusicCardProps) {
  const { playing, progress } = useTrack(previewUrl);

  return (
    <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3.5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-white/10">
          {artworkUrl && (
            <Image src={artworkUrl} alt={`${title} cover art`} fill sizes="64px" className="object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            <Equalizer active={playing} />
            {playing ? "Now playing" : label}
          </p>
          <p className="mt-0.5 truncate text-[15px] font-medium text-foreground">{title}</p>
          <p className="truncate text-xs text-muted">{artist}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 pr-1">
          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title} on Spotify`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:text-[#1DB954]"
            >
              <FaSpotify className="h-[18px] w-[18px]" />
            </a>
          )}
          {previewUrl && (
            <button
              type="button"
              onClick={() => toggleTrack(previewUrl)}
              aria-label={playing ? `Pause ${title}` : `Play a preview of ${title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
            </button>
          )}
        </div>
      </div>

      {/* thin progress line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/[0.06] dark:bg-white/10">
        <div
          className="h-full bg-foreground/80 transition-[width] duration-300 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
