import Link from "next/link";
import { DeleteItemButton } from "@/components/studio/delete-item-button";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string; error?: string }> }) {
  await requirePortfolioOwner();
  const params = await searchParams;
  const admin = createSupabaseAdminClient();
  const { data: posts } = await admin.from("blog_posts").select("id, title, slug, status, updated_at").order("updated_at", { ascending: false });

  return <main className="min-h-svh"><div className="site-shell py-8 sm:py-10"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><div><p className="eyebrow">Private dashboard</p><h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">Journal posts</h1></div><div className="flex gap-3"><Link className="button-secondary" href="/studio">Dashboard</Link><Link className="button-primary" href="/studio/posts/new">New post</Link></div></header>{params.saved && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Post saved.</p>}{params.deleted && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Post deleted.</p>}{params.error && <p className="mt-6 rounded-lg border border-red-200/20 bg-red-200/10 p-3 text-sm text-red-100">The post could not be saved or deleted. Try again.</p>}<section className="py-8">{posts?.length ? <div className="divide-y divide-white/10 border-y border-white/10">{posts.map((post) => <article key={post.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div><p className="text-lg font-medium text-white">{post.title}</p><p className="mt-1 text-sm text-zinc-500">/{post.slug} · {post.status}</p></div><div className="flex items-center gap-3"><Link className="button-secondary" href={`/studio/posts/${post.id}`}>Edit</Link><DeleteItemButton id={post.id} title={post.title} type="post" /></div></article>)}</div> : <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-zinc-400">No posts yet. Your first field note starts here.</div>}</section></div></main>;
}
