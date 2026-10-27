import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Shared frame for every inner page: top rule, back link, serif title, content, footer. */
export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main>
      <div className="h-14 sm:h-24" />
      <div className="rule" />
      <header className="px-6 sm:px-10 pt-8 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 py-2 -my-2 mb-3 text-xs text-muted hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>
        <h1 className="font-serif text-[34px] sm:text-[42px] font-normal leading-[1.15] text-foreground">{title}</h1>
        {description && <p className="mt-2 text-[15px] text-muted leading-relaxed max-w-xl">{description}</p>}
      </header>
      <div className="rule" />
      <Reveal>
        <div className="px-6 sm:px-10 py-8">{children}</div>
      </Reveal>
      <div className="rule" />
      <SiteFooter />
    </main>
  );
}
