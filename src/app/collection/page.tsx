import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Bookshelf } from "@/components/bookshelf";
import { VinylRecord } from "@/components/vinyl-record";
import { books, collectionIntro, movies, songs, videos, wishlist } from "@/data/collection";
import { getTrackMedia, spotifyTrackUrl } from "@/lib/tracks";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Collection",
  description: "A living library of books, videos, songs and movies I love.",
  alternates: { canonical: "/collection" },
};

const favoriteText = "text-red-600 dark:text-red-400";

function Item({
  title,
  href,
  favorite,
  children,
}: {
  title: string;
  href?: string;
  favorite?: boolean;
  children?: React.ReactNode;
}) {
  const titleClass = cn(
    "font-medium",
    favorite ? favoriteText : "text-foreground",
    href && "underline decoration-neutral-400/50 underline-offset-4 hover:text-accent hover:decoration-accent transition-colors"
  );

  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[15px]">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={titleClass}>
          {title}
        </a>
      ) : (
        <span className={titleClass}>{title}</span>
      )}
      {children}
    </li>
  );
}

const Meta = ({ children }: { children: React.ReactNode }) => <span className="text-muted">{children}</span>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-8 first:pt-0 border-t border-dashed border-neutral-300/80 dark:border-neutral-700/80 first:border-t-0">
      <h2 className="font-serif text-2xl font-normal text-foreground mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default async function CollectionPage() {
  const hasFavorites = [...books, ...videos, ...songs, ...movies].some((i) => i.favorite);
  const songMedia = await Promise.all(songs.map((s) => getTrackMedia(s.appleId)));
  const anyPreview = songMedia.some((m) => m.previewUrl);

  return (
    <PageShell title="Collection" description={collectionIntro}>
      {hasFavorites && (
        <p className="mb-8 text-sm text-muted">
          items in <span className={favoriteText}>red</span> either hit me hard or are things i really want so badly.
        </p>
      )}

      {books.length > 0 && (
        <Section title="books i read">
          <Bookshelf books={books} />
        </Section>
      )}

      {songs.length > 0 && (
        <Section title="songs i like">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {songs.map((s, i) => (
              <VinylRecord
                key={s.title}
                title={s.title}
                artist={s.artist}
                artworkUrl={songMedia[i].artworkUrl}
                previewUrl={songMedia[i].previewUrl}
                spotifyUrl={spotifyTrackUrl(s.spotifyId) ?? s.href ?? null}
              />
            ))}
          </div>
          {anyPreview && <p className="mt-8 text-xs text-muted/70">30-second previews and artwork courtesy of Apple Music.</p>}
        </Section>
      )}

      {videos.length > 0 && (
        <Section title="must watch videos">
          <ul className="space-y-2.5">
            {videos.map((v) => (
              <Item key={v.title} title={v.title} href={v.href} favorite={v.favorite}>
                <Meta>({v.duration})</Meta>
              </Item>
            ))}
          </ul>
        </Section>
      )}

      {movies.length > 0 && (
        <Section title="movies i love">
          <ul className="space-y-2.5">
            {movies.map((m) => (
              <Item key={m.title} title={m.title} href={m.href} favorite={m.favorite}>
                <Meta>
                  {m.director} ({m.minutes}m)
                </Meta>
              </Item>
            ))}
          </ul>
        </Section>
      )}

      {wishlist.length > 0 && (
        <Section title="i need">
          <ul className="space-y-2.5">
            {wishlist.map((w) => (
              <Item key={w.title} title={w.title} href={w.href}>
                {w.note && <Meta>{w.note}</Meta>}
              </Item>
            ))}
          </ul>
        </Section>
      )}
    </PageShell>
  );
}
