import { notFound } from "next/navigation";
import Link from "next/link";
import { PostEditor } from "@/components/studio/post-editor";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePortfolioOwner();
  const admin = createSupabaseAdminClient();
  const { data: post } = await admin.from("blog_posts").select("id, title, slug, excerpt, body_markdown, tags, status").eq("id", (await params).id).maybeSingle();
  if (!post) notFound();
  return <main className="min-h-svh"><div className="site-shell max-w-3xl py-8 sm:py-10"><Link className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/studio/posts">← All posts</Link><p className="eyebrow mt-10">Edit field note</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-white">{post.title}</h1><div className="mt-10"><PostEditor post={post} /></div></div></main>;
}
