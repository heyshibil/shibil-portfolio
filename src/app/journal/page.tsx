import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = { title: "Journal | Shibil Mohammed", description: "Life notes and reflections by Shibil Mohammed." };
export const revalidate = 3600;

export default async function JournalPage() {
  const supabase = createSupabasePublicClient();
  const posts = supabase ? (await supabase.from("blog_posts").select("id, title, slug, excerpt, tags, published_at").eq("status", "published").order("published_at", { ascending: false })).data ?? [] : [];
  return <main><div className="site-shell"><SiteHeader activePath="/journal" /><section className="py-20 sm:py-28"><p className="eyebrow">Field notes</p><h1 className="mt-5 max-w-4xl text-balance text-5xl font-medium tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">Notes from the quieter parts of the journey.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">Not a technical blog. A place for thoughts on life, curiosity, work, growth, and the things worth paying attention to.</p></section><section className="section-rule py-16 sm:py-24">{posts.length ? <div className="divide-y divide-white/10 border-y border-white/10">{posts.map((post) => <article key={post.id} className="py-8"><p className="eyebrow">{post.published_at ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(post.published_at)) : "Field note"}</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.045em] text-white"><Link className="transition hover:text-emerald-100" href={`/journal/${post.slug}`}>{post.title}</Link></h2>{post.excerpt && <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{post.excerpt}</p>}<p className="mt-4 text-sm text-emerald-100/80">{post.tags?.join(" · ")}</p><Link className="mt-5 inline-flex text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href={`/journal/${post.slug}`}>Read note →</Link></article>)}</div> : <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 sm:p-12"><p className="eyebrow">First entry pending</p><p className="mt-5 max-w-2xl text-2xl leading-9 text-zinc-200">The journal is ready for your writing. Your first published field note will appear here.</p></div>}</section><SiteFooter /></div></main>;
}
