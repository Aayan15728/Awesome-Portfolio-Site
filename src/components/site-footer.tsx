import Link from "next/link";
import { VisitorCount } from "@/components/visitor-count";
import { FooterLive } from "@/components/footer-live";
import { getLastPushAt } from "@/lib/github";
import { NAV } from "@/lib/nav";
import { siteConfig } from "@/lib/site";

export async function SiteFooter() {
  const lastPushAt = await getLastPushAt(siteConfig.githubUsername);

  return (
    <footer className="px-6 sm:px-10 pt-8">
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-0.5 mb-5">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center py-1.5 pointer-coarse:py-3 text-sm text-muted hover:text-foreground transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <FooterLive
        place={siteConfig.location.label}
        timeZone={siteConfig.location.timeZone}
        lastPushAt={lastPushAt}
        githubUrl={siteConfig.social.github}
      />

      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            Designed &amp; developed by <span className="text-foreground font-medium">{siteConfig.name}</span>
          </p>
          <p className="text-xs text-muted/60 mt-0.5">&copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
        <VisitorCount />
      </div>

      {/* signature wordmark, cut off by the bottom edge of the page */}
      <div
        data-footer-wordmark
        aria-hidden
        className="pointer-events-none mt-12 select-none overflow-hidden text-center [font-size:clamp(44px,15vw,124px)] h-[0.68em]"
      >
        <span className="inline-block whitespace-nowrap bg-gradient-to-b from-foreground/45 via-foreground/20 to-foreground/[0.04] bg-clip-text font-serif leading-[0.8] tracking-[-0.02em] text-transparent">
          {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
