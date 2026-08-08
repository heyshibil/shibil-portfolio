import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSupabasePublicClient } from "@/lib/supabase/public";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createSupabasePublicClient();
  const { data: post } = await supabase.from("blog_posts").select("title, excerpt").eq("slug", (await params).slug).eq("status", "published").maybeSingle();
  return post ? { title: `${post.title} | Shibil Mohammed`, description: post.excerpt ?? "A field note by Shibil Mohammed." } : {};
}

export default async function JournalPostPage({ params }: Props) {
  const supabase = createSupabasePublicClient();
  const { data: post } = await supabase.from("blog_posts").select("title, excerpt, body_markdown, tags, published_at").eq("slug", (await params).slug).eq("status", "published").maybeSingle();
  if (!post) notFound();
  const date = post.published_at ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.published_at)) : "Field note";
  return <main><div className="site-shell"><SiteHeader activePath="/journal" /><article className="mx-auto max-w-3xl py-16 sm:py-24"><Link className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/journal">← All field notes</Link><p className="eyebrow mt-12">{date}</p><h1 className="mt-4 text-balance text-4xl font-medium tracking-[-0.055em] text-white sm:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-6 text-xl leading-8 text-zinc-300">{post.excerpt}</p>}<p className="mt-5 text-sm text-emerald-100/80">{post.tags?.join(" · ")}</p><div className="journal-prose mt-14"><ReactMarkdown>{post.body_markdown}</ReactMarkdown></div></article><SiteFooter /></div></main>;
}
