/**
 * Add your projects here. They appear on the home page (featured ones) and on /projects.
 * Drop screenshots in /public/assets and reference them with `imageSrc`.
 */
export type ProjectCategory = "web" | "hackathon" | "content" | "other";
export type ProjectStatus = "Live" | "In progress" | "Completed" | "Archived";

export interface Project {
  title: string;
  description: string;
  /** Live URL (or the main link for the project). */
  href: string;
  /** Optional source repository. */
  github?: string;
  imageSrc?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Free-form date label, e.g. "May 2026" or "8-11 May, 2026". */
  date?: string;
  tags?: string[];
  /** Show on the home page. */
  featured?: boolean;
}

export const PROJECT_CATEGORIES: Record<ProjectCategory, string> = {
  web: "Web Apps",
  hackathon: "Hackathons",
  content: "Content",
  other: "Other",
};

export const projects: Project[] = [
  {
    title: "Buildrship",
    description:
      "Discover the curated launch platform for buildrs who ship. Launch products, collect feedback, and reach early adopters. Submit your product today.",
    href: "https://buildrship.xyz",
    imageSrc: "/assets/buildrship.png",
    category: "web",
    status: "Live",
    featured: true,
  },
  {
    title: "ZeroMRR",
    description:
      "A platform where founders share their journey and compete through real progress. Built to make building in public more engaging, consistent, and real.",
    href: "https://zeromrr.netlify.app",
    imageSrc: "/assets/zeromrr.png",
    category: "web",
    status: "Live",
    featured: true,
  },
  {
    title: "GenZGames",
    description:
      "Fast, simple, and addictive web games built for the GenZ internet. Focused on speed, fun, and keeping users coming back.",
    href: "https://genzgames.fun",
    imageSrc: "/assets/genzgames.png",
    category: "web",
    status: "Live",
    featured: true,
  },
  {
    title: "FUTSnaps91",
    description:
      "A football content brand built around edits, highlights, and audience engagement. Exploring content, distribution, and building an online audience.",
    href: "https://youtube.com/@futsnaps91",
    imageSrc: "/assets/futsnaps91.png",
    category: "content",
    status: "Live",
    featured: true,
  },
  {
    title: "SwiftYourLink",
    description:
      "A simple tool to manage and share multiple links through one clean profile. Built for creators who want speed and simplicity.",
    href: "https://swiftyourlink.vercel.app",
    imageSrc: "/assets/swiftyourlink.png",
    category: "web",
    status: "Live",
    featured: true,
  },
];
