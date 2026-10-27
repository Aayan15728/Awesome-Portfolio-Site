import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Mdx } from "@/components/mdx";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/writings/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.siteUrl },
    mainEntityOfPage: `${siteConfig.siteUrl}/writings/${post.slug}`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="h-14 sm:h-24" />
      <div className="rule" />
      <header className="px-6 sm:px-10 pt-8 pb-8">
        <Link
          href="/writings"
          className="inline-flex items-center gap-1.5 py-2 -my-2 mb-3 text-xs text-muted hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All writings
        </Link>
        <h1 className="font-serif text-[32px] sm:text-[42px] font-normal leading-[1.15] text-foreground">{post.title}</h1>
        <p className="mt-3 text-xs text-muted">
          {formatDate(post.date)} &middot; {post.readingMinutes} min read
          {post.tags.length > 0 && <> &middot; {post.tags.map((t) => `#${t}`).join(" ")}</>}
        </p>
      </header>
      <div className="rule" />
      <Reveal>
        <article className="px-6 sm:px-10 py-6">
          <Mdx source={post.content} />
        </article>
      </Reveal>
      <div className="rule" />
      <SiteFooter />
    </main>
  );
}
