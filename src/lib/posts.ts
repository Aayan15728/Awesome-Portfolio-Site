import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

/**
 * Writings live as MDX files in /content/writings. Frontmatter:
 *
 *   ---
 *   title: "My post"
 *   date: "2026-05-01"
 *   summary: "One sentence shown in lists and link previews."
 *   tags: ["nextjs", "notes"]
 *   draft: false        # drafts are hidden in production
 *   ---
 */
const POSTS_DIR = path.join(process.cwd(), "content", "writings");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

function parseFile(file: string): Post | null {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const { data, content } = matter(raw);

  if (data.draft && process.env.NODE_ENV === "production") return null;
  if (typeof data.title !== "string" || !data.date) {
    console.warn(`[writings] skipping ${file}: frontmatter needs "title" and "date"`);
    return null;
  }

  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);

  return {
    slug,
    title: data.title,
    date,
    summary: typeof data.summary === "string" ? data.summary : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .filter((p): p is Post => p !== null)
    .map(
      (p): PostMeta => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        summary: p.summary,
        tags: p.tags,
        readingMinutes: p.readingMinutes,
      })
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  // slugs come from the URL: only allow plain file names
  if (!/^[a-z0-9-_]+$/i.test(slug)) return null;
  for (const ext of [".mdx", ".md"]) {
    if (fs.existsSync(path.join(POSTS_DIR, slug + ext))) return parseFile(slug + ext);
  }
  return null;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
