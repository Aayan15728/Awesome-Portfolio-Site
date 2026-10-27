import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ProjectCard, ProjectGrid } from "@/components/project-card";
import GitHubContributions from "@/components/github-contributions";
import { Thoughts, type Thought } from "@/components/thoughts";
import { CommandTrigger } from "@/components/command-trigger";
import { SiteFooter } from "@/components/site-footer";
import { MusicCard } from "@/components/music-card";
import { songs } from "@/data/collection";
import { getTrackMedia, spotifyTrackUrl } from "@/lib/tracks";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { ArrowRight, Mail } from "lucide-react";
import {
  SiReact, SiTypescript, SiNextdotjs, SiNodedotjs, SiPostgresql, SiSupabase,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { projects } from "@/data/projects";
import { formatDate, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

const BIRTH_DATE = { year: 2011, month: 10, day: 4 };

function getCurrentAge(referenceDate = new Date()) {
  const birthDate = new Date(BIRTH_DATE.year, BIRTH_DATE.month, BIRTH_DATE.day);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
      referenceDate.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

const SOCIALS = [
  { icon: FaGithub, label: "GitHub", href: siteConfig.social.github },
  { icon: FaXTwitter, label: "X", href: siteConfig.social.x },
  { icon: FaLinkedin, label: "LinkedIn", href: siteConfig.social.linkedin },
  { icon: Mail, label: "Email", href: siteConfig.social.email },
];

const SKILLS = [
  { Icon: SiReact, label: "React", color: "#61DAFB" },
  { Icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { Icon: SiNextdotjs, label: "Next.js", color: "currentColor" },
  { Icon: SiNodedotjs, label: "Node.js", color: "#339933" },
  { Icon: SiSupabase, label: "Supabase", color: "#3FCF8E" },
  { Icon: SiPostgresql, label: "PostgreSQL", color: "#336791" },
] as const;

const THOUGHTS: Thought[] = [
  {
    title: "How I Use AI as a Tool, Not a Crutch",
    body: "AI accelerates my workflow, but I make sure I understand every line it helps produce. I use it for boilerplate, rapid exploration, and ideation - never as a replacement for thinking. The goal is leverage, not dependency.",
  },
  {
    title: "How I Learn New Tech Without Getting Overwhelmed",
    body: "I pick one thing, build something real with it, ship it, then iterate. No tutorial hell - the best way to understand a technology is to break it while building something that matters to you.",
  },
  {
    title: "How I Turn Confusion Into Clear, Working Systems",
    body: "When a problem feels overwhelming I decompose it into atomic units, write down what I don't understand, and work through each piece methodically. Clarity comes from structure, not raw intelligence.",
  },
];

const section = "px-6 sm:px-10 py-10";
const heading = "font-serif text-[26px] sm:text-3xl font-normal text-foreground leading-tight mb-5";
const seeAll =
  "inline-flex items-center gap-1 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-200 group";
const chip =
  "inline-flex items-center gap-1.5 rounded-[4px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-3 py-1.5 text-xs font-medium text-foreground tracking-tight transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.98]";

/** Inline tech mention with its logo, used inside the bio sentence. */
function Tech({ Icon, label, color }: { Icon: IconType; label: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-medium text-foreground whitespace-nowrap">
      <Icon className="w-3.5 h-3.5 shrink-0" style={color ? { color } : undefined} aria-hidden />
      {label}
    </span>
  );
}

export default async function Home() {
  const currentAge = getCurrentAge();
  const featuredSong = songs.find((s) => s.title === siteConfig.featuredSongTitle) ?? songs[0];
  const featuredMedia = await getTrackMedia(featuredSong?.appleId);
  const featured = projects.filter((p) => p.featured);
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <main>
      {/* breathing room + top boundary */}
      <div className="h-20 sm:h-36" />
      <div className="rule" />

      {/* HERO */}
      <Reveal delay={0.05}>
        <section className="px-6 sm:px-10 pt-10 pb-10">
          <header className="flex items-start gap-4 sm:gap-6 mb-8">
            <div className="relative shrink-0 w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] rounded-2xl p-1.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/assets/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  sizes="104px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
              <div className="min-w-0 sm:pt-3">
                <h1 className="font-serif text-[28px] sm:text-[42px] font-normal leading-[1.15] text-foreground">
                  Hi, I&apos;m {siteConfig.name}
                </h1>
                <p className="font-serif text-base sm:text-lg text-muted mt-1">
                  {currentAge}y &bull; dev &bull; builder &bull; web dev
                </p>
              </div>
              <CommandTrigger className="shrink-0 hidden sm:inline-flex" />
            </div>
          </header>

          <div className="text-[15px] sm:text-base text-muted leading-[1.85] space-y-4">
            <p>
              I&apos;m a{" "}
              <span className="relative inline-block font-medium text-foreground">
                Full Stack Developer
                <svg
                  aria-hidden
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  className="absolute left-0 -bottom-1 w-full h-2 text-foreground/50"
                >
                  <path
                    d="M1 5.5 C 22 1.5, 48 7.5, 99 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              focused on shipping real products, fast. I use{" "}
              <Tech Icon={SiReact} label="React" color="#61DAFB" /> and{" "}
              <Tech Icon={SiNextdotjs} label="Next.js" /> to build frontends,{" "}
              <Tech Icon={SiNodedotjs} label="Node.js" color="#339933" /> for backends, with{" "}
              <Tech Icon={SiSupabase} label="Supabase" color="#3FCF8E" /> for data and auth.
            </p>
            <p>
              While most people are still planning, I&apos;m already shipping - building full-stack apps,
              experimenting with AI, and launching things people can actually use.
            </p>
            <p>
              I don&apos;t care about hype or perfect code. I care about execution - taking something from zero to
              live, testing it with real users, and improving it fast.
            </p>
          </div>

          <ul className="mt-6 space-y-1.5 text-[15px] text-muted">
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="text-muted/60">&#10022;</span>
              <span>
                <span className="text-foreground font-medium">Open source</span> contributor
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="text-muted/60">&#10022;</span>
              <span>
                Specialized in building <span className="text-foreground font-medium">MVPs</span>
              </span>
            </li>
          </ul>

          <p className="mt-8 mb-3 text-sm text-muted">
            Here are my <span className="text-foreground font-medium">socials</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={`${label} profile of ${siteConfig.name}`} className={chip}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="rule" />

      {/* MUSIC */}
      <Reveal>
        <section className="px-6 sm:px-10 py-8">
          {featuredSong && (
            <MusicCard
              title={featuredSong.title}
              artist={featuredSong.artist}
              artworkUrl={featuredMedia.artworkUrl}
              previewUrl={featuredMedia.previewUrl}
              spotifyUrl={spotifyTrackUrl(featuredSong.spotifyId) ?? featuredSong.href ?? null}
            />
          )}
        </section>
      </Reveal>

      <div className="rule" />

      {/* SKILLS */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(({ Icon, label, color }) => (
              <div key={label} className="group relative">
                {/* focusable so the label also shows on tap (touch) and keyboard focus, not just mouse hover */}
                <div
                  tabIndex={0}
                  role="img"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/50 dark:bg-white/[0.04] hover:bg-neutral-200/60 dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-accent transition-colors duration-200 cursor-default"
                  style={{ color }}
                >
                  <Icon className="w-[18px] h-[18px]" aria-hidden />
                </div>
                <div aria-hidden className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 shadow-md z-10">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="rule" />

      {/* PROJECTS */}
      <Reveal>
        <section className={section}>
          <div className="flex items-end justify-between mb-5">
            <h2 className={`${heading} !mb-0`}>Projects</h2>
            <Link href="/projects" className={seeAll}>
              See all <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ProjectGrid>
            {featured.map((p, i) => (
              <ProjectCard key={p.title} project={p} wide={i === 0 && featured.length % 2 === 1} />
            ))}
          </ProjectGrid>
        </section>
      </Reveal>

      {latestPosts.length > 0 && (
        <>
          <div className="rule" />
          {/* WRITINGS */}
          <Reveal>
            <section className={section}>
              <div className="flex items-end justify-between mb-3">
                <h2 className={`${heading} !mb-0`}>Writings</h2>
                <Link href="/writings" className={seeAll}>
                  See all <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <ul className="divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/writings/${post.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3.5 group"
                    >
                      <span className="text-[15px] font-medium text-foreground/90 group-hover:text-accent transition-colors duration-200">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted whitespace-nowrap">{formatDate(post.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </>
      )}

      <div className="rule" />

      {/* GITHUB ACTIVITY */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>GitHub Activity</h2>
          <div className="rounded-xl border border-dashed border-neutral-300/80 dark:border-neutral-700/80 bg-neutral-100/40 dark:bg-white/[0.03] p-3">
            <GitHubContributions username={siteConfig.githubUsername} />
          </div>
        </section>
      </Reveal>

      <div className="rule" />

      {/* THOUGHTS */}
      <Reveal>
        <section className={section}>
          <h2 className={heading}>Thoughts</h2>
          <Thoughts items={THOUGHTS} />
        </section>
      </Reveal>

      <div className="rule" />

      {/* QUOTE */}
      <Reveal>
        <section className={section}>
          <p className="font-serif text-2xl sm:text-[28px] text-foreground leading-snug">
            &ldquo;Just Become Irreplaceable.&rdquo;
          </p>
          <p className="text-sm text-muted mt-3">
            &mdash; <span className="text-accent font-medium">{siteConfig.name}</span>
          </p>
        </section>
      </Reveal>

      <div className="rule" />

      <SiteFooter />
    </main>
  );
}
