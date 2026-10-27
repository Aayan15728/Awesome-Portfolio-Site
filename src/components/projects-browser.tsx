"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ProjectCard, ProjectGrid } from "@/components/project-card";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();

  // only offer tabs for categories that actually have projects
  const categories = (Object.keys(PROJECT_CATEGORIES) as ProjectCategory[]).filter((c) =>
    projects.some((p) => p.category === c)
  );
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);
  // an odd number of cards leaves a hole, so the first one takes the full row
  const firstIsWide = visible.length % 2 === 1 && visible.length > 1;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({
      key: c as Filter,
      label: PROJECT_CATEGORIES[c],
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <>
      {categories.length > 1 && (
        <LayoutGroup id="project-filters">
          <div
            role="tablist"
            aria-label="Filter projects"
            className="mb-6 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-black/10 bg-neutral-100/70 p-1 dark:border-white/10 dark:bg-white/[0.04]"
          >
            {tabs.map((t) => {
              const selected = active === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                    selected ? "text-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="project-filter-pill"
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                      className="absolute inset-0 rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/10"
                    />
                  )}
                  <span className="relative inline-flex items-center gap-1.5">
                    {t.label}
                    <span className="text-[10px] tabular-nums text-muted/70">{t.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      )}

      <ProjectGrid>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.div
              key={p.title}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : i * 0.04 }}
              className={cn("flex", i === 0 && firstIsWide && "sm:col-span-2")}
            >
              <ProjectCard project={p} wide={i === 0 && firstIsWide} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </ProjectGrid>
    </>
  );
}
