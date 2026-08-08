import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/studio/project-editor";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePortfolioOwner();
  const { data: project } = await createSupabaseAdminClient().from("projects").select("id, name, slug, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url, is_published, sort_order").eq("id", (await params).id).maybeSingle();
  if (!project) notFound();
  return <main className="min-h-svh"><div className="site-shell max-w-3xl py-8 sm:py-10"><Link className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/studio/projects">← All projects</Link><p className="eyebrow mt-10">Edit project</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-white">{project.name}</h1><div className="mt-10"><ProjectEditor project={project} /></div></div></main>;
}
