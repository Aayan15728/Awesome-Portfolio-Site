# awosome_portfolio-site

**A minimal, editorial personal portfolio: projects, writings, a living collection and a public goals tracker.**

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion and next-themes.

## Screenshots

![Portfolio Preview](./public/assets/preview-1.png)
![Portfolio Preview 2](./public/assets/preview-2.png)

## Features

- Light-first design with a dotted frame, serif headings and a dark mode
- `⌘K` / `Ctrl K` command palette for quick navigation
- `/projects`: filterable project cards with status, tags, Live and GitHub links
- `/writings`: MDX blog with frontmatter, reading time, RSS (`/rss.xml`) and per-post metadata
- `/collection`: books, must-watch videos, songs, movies and a wishlist, all typed arrays
- `/goal`: public goals with a % per goal and an overall %; only the owner (password) can add, update, check off and delete
- Live GitHub contribution heatmap and a unique-visitor counter
- SEO foundation: metadata, Open Graph, Twitter cards, JSON-LD, robots, sitemap and manifest

## Quick start

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open <http://localhost:3000>.

## Make it yours

| What                     | Where                                                        |
| ------------------------ | ------------------------------------------------------------ |
| Name, bio links, SEO     | `src/lib/site.ts`, `src/app/page.tsx`                        |
| Projects                 | `src/data/projects.ts` (screenshots go in `public/assets`)   |
| Collection               | `src/data/collection.ts`                                     |
| Writings                 | `content/writings/*.mdx`                                     |
| Goals                    | edit live on `/goal` after unlocking with your password      |

## Environment variables

All optional, see [.env.example](./.env.example).

| Variable                                         | Purpose                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                           | Canonical URL for SEO, sitemap and RSS                      |
| `ADMIN_PASSWORD`                                 | Unlocks editing on `/goal` (without it the page is read-only) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`      | Persistent storage for goals and the visitor counter        |
| `GITHUB_TOKEN`                                   | Optional; raises the rate limit for the footer's "last shipped" line |

To use Supabase, run [`supabase/schema.sql`](./supabase/schema.sql) once in your project's SQL editor. The tables have Row Level Security enabled with no public policies, so only the server (using the service-role key, which must never be exposed to the browser) can read or write them.

Without Supabase credentials data is stored in `./data/*.json`. That works locally but **does not persist on serverless hosts** (Vercel, Netlify), so configure Supabase before deploying if you use `/goal` or the visitor counter.

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build
- `npm run start` run the production build
- `npm run lint` run ESLint

## Contributing

PRs are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## License

MIT, see [LICENSE](./LICENSE).
