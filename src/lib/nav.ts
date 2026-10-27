export interface NavItem {
  label: string;
  href: string;
  hint: string;
}

/** Single source of truth for site navigation (footer, command palette). */
export const NAV: NavItem[] = [
  { label: "Home", href: "/", hint: "Back to the homepage" },
  { label: "Projects", href: "/projects", hint: "Things I've built" },
  { label: "Writings", href: "/writings", hint: "Notes and essays" },
  { label: "Collection", href: "/collection", hint: "Books, videos, movies and more" },
  { label: "Goals", href: "/goal", hint: "What I'm working towards" },
];
