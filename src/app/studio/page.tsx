import Link from "next/link";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requirePortfolioOwner();
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return <main className="min-h-svh"><div className="site-shell py-8 sm:py-10"><header className="flex items-center justify-between border-b border-white/10 pb-6"><div><p className="eyebrow">Private dashboard</p><h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">Portfolio studio</h1></div><Link className="button-secondary" href="/">View site ↗</Link></header><section className="py-12"><p className="text-zinc-400">Signed in as {user.email}</p><p className="mt-6 rounded-lg border border-red-200/20 bg-red-200/10 p-4 text-sm text-red-100">Studio content is unavailable until the Supabase admin environment variables are configured.</p></section></div></main>;
  }

  const [projects, posts, experiences] = await Promise.all([
    admin.from("projects").select("id", { count: "exact", head: true }),
    admin.from("blog_posts").select("id", { count: "exact", head: true }),
    admin.from("experiences").select("id", { count: "exact", head: true }),
  ]);
  const cards = [["Projects", projects.count ?? 0], ["Journal posts", posts.count ?? 0], ["Experience entries", experiences.count ?? 0]];

  return <main className="min-h-svh"><div className="site-shell py-8 sm:py-10"><header className="flex items-center justify-between border-b border-white/10 pb-6"><div><p className="eyebrow">Private dashboard</p><h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">Portfolio studio</h1></div><Link className="button-secondary" href="/">View site ↗</Link></header><section className="py-12"><p className="text-zinc-400">Signed in as {user.email}</p><div className="mt-7 grid gap-4 sm:grid-cols-3">{cards.map(([label, count]) => <article key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><p className="text-sm text-zinc-400">{label}</p><p className="mt-4 text-4xl font-medium tracking-[-0.05em] text-white">{count}</p></article>)}</div><div className="mt-10 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/[0.06] p-6"><p className="eyebrow">Journal</p><p className="mt-3 max-w-xl text-lg leading-8 text-zinc-200">Draft, edit, publish, or delete your field notes without touching the codebase.</p><Link className="button-primary mt-6" href="/studio/posts">Manage journal posts ↗</Link></div><div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/[0.06] p-6"><p className="eyebrow">Projects</p><p className="mt-3 max-w-xl text-lg leading-8 text-zinc-200">Add and maintain the products that demonstrate your strongest engineering work.</p><Link className="button-primary mt-6" href="/studio/projects">Manage projects ↗</Link></div></div></section></div></main>;
}
