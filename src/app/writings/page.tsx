import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writings",
  description: "Notes, essays and things I've learned while building.",
  alternates: { canonical: "/writings", types: { "application/rss+xml": "/rss.xml" } },
};

export default function WritingsPage() {
  const posts = getAllPosts();

  return (
    <PageShell title="Writings" description="Notes, essays and things I've learned while building.">
      {posts.length === 0 ? (
        <p className="text-sm text-muted">Nothing here yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writings/${post.slug}`} className="group block py-5 first:pt-0">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[17px] font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h2>
                  <span className="text-xs text-muted whitespace-nowrap">{formatDate(post.date)}</span>
                </div>
                {post.summary && <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.summary}</p>}
                <p className="mt-2 text-xs text-muted/70">
                  {post.readingMinutes} min read
                  {post.tags.length > 0 && <> &middot; {post.tags.map((t) => `#${t}`).join(" ")}</>}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
