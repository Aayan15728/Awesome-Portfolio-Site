import { useSyncExternalStore } from "react";

/**
 * One shared <audio> element for the whole site, so starting a track anywhere
 * (home card, a vinyl on /collection) stops whatever was playing before.
 */
interface PlayerState {
  src: string | null;
  playing: boolean;
  /** 0-1 through the current track. */
  progress: number;
}

const SERVER_STATE: PlayerState = { src: null, playing: false, progress: 0 };

let audio: HTMLAudioElement | null = null;
let state: PlayerState = SERVER_STATE;
const listeners = new Set<() => void>();

function emit(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function getAudio(): HTMLAudioElement {
  if (audio) return audio;
  const el = new Audio();
  el.preload = "none";
  el.addEventListener("play", () => emit({ playing: true }));
  el.addEventListener("pause", () => emit({ playing: false }));
  el.addEventListener("ended", () => emit({ playing: false, progress: 0 }));
  el.addEventListener("timeupdate", () => emit({ progress: el.duration ? el.currentTime / el.duration : 0 }));
  audio = el;
  return el;
}

export function toggleTrack(src: string) {
  const el = getAudio();
  if (state.src !== src) {
    el.src = src;
    emit({ src, progress: 0 });
    el.play().catch(() => emit({ playing: false }));
  } else if (el.paused) {
    el.play().catch(() => emit({ playing: false }));
  } else {
    el.pause();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Playback state for one track: whether it's the one playing and how far along it is. */
export function useTrack(src: string | null | undefined) {
  const s = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  const isCurrent = !!src && s.src === src;
  return { playing: isCurrent && s.playing, progress: isCurrent ? s.progress : 0 };
}
