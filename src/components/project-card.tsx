import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const STATUS: Record<Project["status"], { dot: string; pill: string; pulse: boolean }> = {
  Live: { dot: "bg-emerald-500", pill: "text-emerald-700 dark:text-emerald-400", pulse: true },
  Completed: { dot: "bg-emerald-500", pill: "text-emerald-700 dark:text-emerald-400", pulse: false },
  "In progress": { dot: "bg-amber-500", pill: "text-amber-700 dark:text-amber-400", pulse: true },
  Archived: { dot: "bg-neutral-400", pill: "text-muted", pulse: false },
};

/** Wrapper that dims the other cards while one is hovered (spotlight effect). */
export function ProjectGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("group/grid grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

interface ProjectCardProps {
  project: Project;
  /** Spans both grid columns with a wider image. */
  wide?: boolean;
  className?: string;
}

export function ProjectCard({ project, wide = false, className }: ProjectCardProps) {
  const status = STATUS[project.status];

  return (
    <article
      className={cn(
        "group/card relative flex flex-col rounded-2xl border border-black/10 bg-white p-1.5 dark:border-white/10 dark:bg-white/[0.04]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/[0.07] dark:hover:border-white/20 dark:hover:shadow-black/40",
        "group-has-[article:hover]/grid:not-hover:opacity-60",
        wide && "sm:col-span-2",
        className
      )}
    >
      {/* screenshot */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-black/5 bg-neutral-100 dark:border-white/5 dark:bg-white/5",
          wide ? "aspect-[2/1]" : "aspect-[16/10]"
        )}
      >
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={`${project.title} screenshot`}
            fill
            sizes={wide ? "(min-width: 640px) 700px, 100vw" : "(min-width: 640px) 340px, 100vw"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-muted/60">
            {project.title}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-medium leading-6 text-foreground">
              {/* stretched link: the whole card is clickable, action buttons sit above it */}
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-accent"
              >
                {project.title}
              </a>
            </h3>
            {project.date && <p className="text-xs text-muted">{project.date}</p>}
          </div>
          <span
            className={cn(
              "mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium dark:border-white/10 dark:bg-white/5",
              status.pill
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              {status.pulse && (
                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", status.dot)} />
              )}
              <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", status.dot)} />
            </span>
            {project.status}
          </span>
        </div>

        <p className={cn("text-[13px] leading-relaxed text-muted", wide ? "line-clamp-2" : "line-clamp-3")}>
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-dashed border-neutral-300/80 bg-neutral-100/50 px-1.5 py-0.5 text-[10px] text-muted dark:border-neutral-700/80 dark:bg-white/[0.04]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-auto flex items-center gap-2 border-t border-dashed border-neutral-300/80 pt-3 dark:border-neutral-700/80">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all duration-200 hover:opacity-85 active:scale-[0.97]"
          >
            Visit site
            <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover/card:-translate-y-px group-hover/card:translate-x-px" />
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:bg-black/5 active:scale-[0.97] dark:border-white/10 dark:hover:bg-white/10"
            >
              <FaGithub className="h-3 w-3" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
