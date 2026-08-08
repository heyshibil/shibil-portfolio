import Link from "next/link";

export function SiteHeader({ activePath }: { activePath?: string }) {
  const navLinks = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
  ];

  return (
    <header className="site-header flex items-center justify-between border-b border-white/10 py-5 sm:py-6">
      <Link
        href="/"
        className="group flex items-center gap-3 font-medium text-white"
        aria-label="Shibil Mohammed, home"
      >
        <span className="grid size-9 place-items-center rounded-full border border-emerald-200/50 text-xs text-emerald-100 shadow-[0_0_12px_rgba(167,243,208,0.12)] transition group-hover:bg-emerald-200 group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(167,243,208,0.2)]">
          SM
        </span>
        <span className="hidden sm:inline">Shibil Mohammed</span>
      </Link>
      <nav aria-label="Primary navigation" className="flex items-center gap-3 text-sm text-zinc-400 sm:gap-6">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            className={`nav-link ${activePath === href ? "nav-link-active" : ""}`}
            href={href}
          >
            {label}
          </Link>
        ))}
        <Link
          className="rounded-full border border-white/15 px-3 py-1.5 text-zinc-100 transition hover:border-emerald-200/60 hover:bg-emerald-200/10 hover:text-emerald-100 sm:px-4"
          href="/#contact"
        >
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}
