"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader({ activePath }: { activePath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  const navLinks = [
    { href: "/work", label: "Work", description: "Selected engineering products & case studies" },
    { href: "/about", label: "About", description: "Background, mindset, and experience" },
    { href: "/journal", label: "Journal", description: "Field notes on work, learning, and life" },
  ];

  const connectLinks = [
    {
      label: "Email",
      value: "shibzzmohd@gmail.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=shibzzmohd@gmail.com&su=Hello%20Shibil%20%E2%80%94%20I'd%20like%20to%20connect&body=Hi%20Shibil%2C%0D%0A%0D%0AMy%20name%20is%20...%20and%20I'm%20reaching%20out%20because%20...%0D%0A%0D%0AThanks%2C%0D%0A",
    },
    {
      label: "LinkedIn",
      value: "shibil-mohammed0770",
      href: "https://www.linkedin.com/in/shibil-mohammed0770/",
    },
    {
      label: "GitHub",
      value: "heyshibil",
      href: "https://github.com/heyshibil",
    },
  ];

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Handle click outside and Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Background Blur Overlay for Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="site-header relative z-50 flex items-center justify-between border-b border-white/10 py-5 sm:py-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-medium text-white tracking-[-0.02em] transition hover:text-emerald-200"
          aria-label="Shibil Mohammed, home"
          onClick={() => setIsOpen(false)}
        >
          Shibil Mohammed
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          {navLinks.map(({ href, label }) => {
            const isActive = (activePath ?? pathname) === href;
            return (
              <Link
                key={href}
                className={`nav-link ${isActive ? "nav-link-active text-white" : ""}`}
                href={href}
              >
                {label}
              </Link>
            );
          })}
          <Link
            className="rounded-full border border-white/15 px-4 py-1.5 text-zinc-100 transition hover:border-emerald-200/60 hover:bg-emerald-200/10 hover:text-emerald-100"
            href={contactHref}
          >
            Let&apos;s talk
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          ref={buttonRef}
          type="button"
          className="flex md:hidden size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/50"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <div className="relative size-5 flex flex-col justify-center items-center">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                isOpen ? "translate-y-0.5 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                isOpen ? "-translate-y-0.5 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>

        {/* Mobile Dropdown Menu Sheet */}
        {isOpen && (
          <div
            id="mobile-nav-menu"
            ref={menuRef}
            className="absolute top-[calc(100%+0.5rem)] inset-x-0 z-50 md:hidden animate-in rounded-2xl border border-white/15 bg-[#101412]/95 p-6 shadow-2xl backdrop-blur-2xl"
          >
            {/* Primary Nav Links */}
            <div className="space-y-1">
              <p className="eyebrow mb-3 text-[0.65rem] text-zinc-500">Navigation</p>
              {navLinks.map(({ href, label, description }) => {
                const isActive = (activePath ?? pathname) === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-base text-white">{label}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Section Divider */}
            <div className="my-5 border-t border-white/10" />

            {/* Dedicated "Let's Connect" Section */}
            <div>
              <p className="eyebrow mb-3 text-[0.65rem] text-emerald-200/90">Let&apos;s Connect</p>

              <div className="grid gap-2">
                {connectLinks.map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm transition hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-medium text-zinc-200">{label}</span>
                      <span className="text-xs text-zinc-500 font-mono">{value}</span>
                    </div>
                    <span className="text-xs text-emerald-200/70" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
