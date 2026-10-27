import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProjectsBrowser } from "@/components/projects-browser";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web apps, experiments and products I've built and shipped.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <PageShell title="Projects" description="Things I've built and shipped, from MVPs to experiments.">
      <ProjectsBrowser projects={projects} />
    </PageShell>
  );
}
