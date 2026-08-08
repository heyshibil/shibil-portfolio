import Link from "next/link";
import { PostEditor } from "@/components/studio/post-editor";
import { requirePortfolioOwner } from "@/lib/auth";

export default async function NewPostPage() {
  await requirePortfolioOwner();
  return <main className="min-h-svh"><div className="site-shell max-w-3xl py-8 sm:py-10"><Link className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/studio/posts">← All posts</Link><p className="eyebrow mt-10">New field note</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-white">Write without the clutter.</h1><div className="mt-10"><PostEditor /></div></div></main>;
}
