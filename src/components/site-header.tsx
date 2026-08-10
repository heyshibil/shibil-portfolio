"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader({ activePath }: { activePath?: string }) {
  const pathname = usePathname();
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  const navLinks = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
  ];

  return (
    <header className="site-header flex items-center justify-between border-b border-white/10 py-5 sm:py-6">
      <Link
        href="/"
        className="font-medium text-white"
        aria-label="Shibil Mohammed, home"
      >
        Shibil Mohammed
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
          href={contactHref}
        >
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}
