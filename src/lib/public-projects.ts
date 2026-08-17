import { getProject, projects, type Project } from "@/lib/portfolio";
import { DEFAULT_PROJECT_COVER, resolveProjectCoverSrc, resolveProjectGallerySrc } from "@/lib/project-cover";
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
  cover_image_path: string | null;
  project_gallery?: { id: string; image_path: string; alt_text: string; sort_order: number }[];
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
    coverSrc: resolveProjectCoverSrc(row.cover_image_path),
    gallery: (row.project_gallery ?? []).sort((a, b) => a.sort_order - b.sort_order).map((image) => ({ id: image.id, src: resolveProjectGallerySrc(image.image_path), alt: image.alt_text || `${row.name} screenshot` })),
  };
}

function withDefaultCover(project: Project): Project {
  return { ...project, coverSrc: project.coverSrc ?? DEFAULT_PROJECT_COVER };
}

export async function getPublishedProjects() {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return projects.map(withDefaultCover);
  }

  try {
    const { data } = await supabase.from("projects").select("slug, name, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url, cover_image_path, project_gallery(id, image_path, alt_text, sort_order)").eq("is_published", true).order("sort_order");
    return data?.length ? data.map(mapProject) : projects.map(withDefaultCover);
  } catch {
    return projects.map(withDefaultCover);
  }
}

export async function getPublishedProject(slug: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    const project = getProject(slug);
    return project ? withDefaultCover(project) : undefined;
  }

  try {
    const { data } = await supabase.from("projects").select("slug, name, project_type, year, summary, scope, stack, challenge, lessons, live_url, github_url, cover_image_path, project_gallery(id, image_path, alt_text, sort_order)").eq("slug", slug).eq("is_published", true).maybeSingle();
    const project = data ? mapProject(data) : getProject(slug);
    return project ? withDefaultCover(project) : undefined;
  } catch {
    const project = getProject(slug);
    return project ? withDefaultCover(project) : undefined;
  }
}
