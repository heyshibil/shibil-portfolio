import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/public-projects";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const projects = await getPublishedProjects();
  const supabase = createSupabasePublicClient();
  const { data: posts } = supabase
    ? await supabase.from("blog_posts").select("slug, updated_at").eq("status", "published")
    : { data: [] as { slug: string; updated_at?: string | null }[] };

  return [
    "",
    "/about",
    "/work",
    "/journal",
    ...projects.map((project) => `/work/${project.slug}`),
    ...(posts ?? []).map((post) => `/journal/${post.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "monthly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
