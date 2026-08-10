import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/studio/project-editor";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ "cover-removed"?: string; error?: string }>;
}) {
  await requirePortfolioOwner();
  const { id } = await params;
  const query = await searchParams;
  const { data: project } = await createSupabaseAdminClient().from("projects").select("id, name, slug, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url, is_published, sort_order, cover_image_path").eq("id", id).maybeSingle();
  if (!project) notFound();
  return <main className="min-h-svh"><div className="site-shell max-w-3xl py-8 sm:py-10"><Link className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/studio/projects">← All projects</Link><p className="eyebrow mt-10">Edit project</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-white">{project.name}</h1>{query["cover-removed"] && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Cover removed. The default image will show on the home page.</p>}{query.error === "save-failed" && <p className="mt-6 rounded-lg border border-red-200/20 bg-red-200/10 p-3 text-sm text-red-100">The cover could not be removed. Try again.</p>}<div className="mt-10"><ProjectEditor project={project} /></div></div></main>;
}
