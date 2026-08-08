export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-emerald-200/[0.12] py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Shibil Mohammed.</p>
      <p className="font-mono text-xs tracking-wider text-zinc-600">Designed with calm. Built with intent.</p>
    </footer>
  );
}
