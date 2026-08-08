import { getProject, projects, type Project } from "@/lib/portfolio";
import { createSupabasePublicClient } from "@/lib/supabase/public";

type ProjectRow = {
  slug: string;
  name: string;
  project_type: string;
  year: number;
  summary: string;
  scope: string[];
  stack: string[];
  challenge: string | null;
  lessons: string | null;
  live_url: string | null;
  github_url: string | null;
};

function mapProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    name: row.name,
    type: row.project_type,
    year: String(row.year),
    description: row.summary,
    details: row.scope,
    stack: row.stack,
    challenge: row.challenge ?? "No engineering challenge has been added yet.",
    lessons: row.lessons ?? "No project reflection has been added yet.",
    liveHref: row.live_url ?? undefined,
    githubHref: row.github_url ?? undefined,
  };
}

export async function getPublishedProjects() {
  const { data } = await createSupabasePublicClient().from("projects").select("slug, name, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url").eq("is_published", true).order("sort_order");
  return data?.length ? data.map(mapProject) : projects;
}

export async function getPublishedProject(slug: string) {
  const { data } = await createSupabasePublicClient().from("projects").select("slug, name, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data ? mapProject(data) : getProject(slug);
}
