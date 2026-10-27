/**
 * Resolves 30-second previews and album art for songs through Apple's public iTunes Search API
 * (no key needed). Spotify no longer offers preview clips to third-party players, so playback
 * uses these, and every track still links out to Spotify.
 *
 * Results are cached for a day; if the lookup fails the UI simply shows the track without a play button.
 */
export interface TrackMedia {
  previewUrl: string | null;
  artworkUrl: string | null;
  appleUrl: string | null;
}

const EMPTY: TrackMedia = { previewUrl: null, artworkUrl: null, appleUrl: null };

export async function getTrackMedia(appleId: number | undefined): Promise<TrackMedia> {
  if (!appleId) return EMPTY;
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${appleId}&entity=song`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return EMPTY;
    const data = (await res.json()) as {
      results?: { previewUrl?: string; artworkUrl100?: string; trackViewUrl?: string }[];
    };
    const track = data.results?.[0];
    if (!track) return EMPTY;
    return {
      previewUrl: track.previewUrl ?? null,
      // the API serves 100px art by default; the same path serves larger sizes
      artworkUrl: track.artworkUrl100?.replace("100x100bb", "600x600bb") ?? null,
      appleUrl: track.trackViewUrl ?? null,
    };
  } catch {
    return EMPTY;
  }
}

export function spotifyTrackUrl(spotifyId: string | undefined): string | null {
  return spotifyId && /^[A-Za-z0-9]{22}$/.test(spotifyId) ? `https://open.spotify.com/track/${spotifyId}` : null;
}
