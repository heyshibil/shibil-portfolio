import { createSupabasePublicClient } from "@/lib/supabase/public";

export const ASSETS_BUCKET = "portfolio-assets";

export type CurrentExperience = {
  id: string;
  organization: string;
  role: string;
  location: string | null;
  description: string;
};

export async function getSiteSettings() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { resumePath: null, experience: null as CurrentExperience | null };

  const [{ data: settings }, { data: experience }] = await Promise.all([
    supabase.from("site_settings").select("resume_path").eq("id", true).maybeSingle(),
    supabase.from("experiences").select("id, organization, role, location, description").eq("is_published", true).is("ended_on", null).order("sort_order").limit(1).maybeSingle(),
  ]);

  return {
    resumePath: settings?.resume_path ?? null,
    experience: experience ?? null,
  };
}

export function resolveAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return baseUrl ? `${baseUrl}/storage/v1/object/public/${ASSETS_BUCKET}/${path}` : null;
}
