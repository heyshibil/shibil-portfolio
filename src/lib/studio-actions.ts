"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePortfolioOwner } from "@/lib/auth";
import { PORTFOLIO_ASSETS_BUCKET, PROJECT_COVER_MAX_BYTES } from "@/lib/project-cover";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ASSETS_BUCKET } from "@/lib/site-settings";

const COVER_MAX_BYTES = PROJECT_COVER_MAX_BYTES;
const COVER_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const RESUME_MAX_BYTES = 8 * 1024 * 1024;

const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(140),
  slug: z.string().trim().max(160).optional(),
  excerpt: z.string().trim().max(320).optional(),
  body: z.string().trim().min(1),
  tags: z.string().trim().optional(),
  status: z.enum(["draft", "published"]),
});

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().max(120).optional(),
  projectType: z.string().trim().min(2).max(120),
  year: z.coerce.number().int().min(2000).max(2100),
  summary: z.string().trim().min(20).max(600),
  scope: z.string().trim().optional(),
  stack: z.string().trim().optional(),
  challenge: z.string().trim().optional(),
  lessons: z.string().trim().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function coverExtension(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return null;
}

async function uploadResume(file: File) {
  const allowed = new Set(["application/pdf"]);
  if (!allowed.has(file.type) || file.size > RESUME_MAX_BYTES) return null;
  const admin = createSupabaseAdminClient();
  if (!admin) return null;
  const path = `resume/shibil-mohammed-${Date.now()}.pdf`;
  const { error } = await admin.storage.from(ASSETS_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  return error ? null : path;
}

const settingsSchema = z.object({
  role: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  location: z.string().trim().max(120).optional(),
  description: z.string().trim().min(10).max(500),
});

export async function saveSiteSettings(formData: FormData) {
  await requirePortfolioOwner();
  const parsed = settingsSchema.safeParse({ role: formData.get("role"), organization: formData.get("organization"), location: formData.get("location") || undefined, description: formData.get("description") });
  if (!parsed.success) redirect("/studio/settings?error=invalid-settings");
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/settings?error=save-failed");

  const { data: current } = await admin.from("experiences").select("id").is("ended_on", null).order("sort_order").limit(1).maybeSingle();
  const experience = { role: parsed.data.role, organization: parsed.data.organization, location: parsed.data.location || null, description: parsed.data.description, started_on: "2025-08-11", ended_on: null, is_published: true, sort_order: 0 };
  const result = current?.id ? await admin.from("experiences").update(experience).eq("id", current.id) : await admin.from("experiences").insert(experience);
  if (result.error) redirect("/studio/settings?error=save-failed");

  const resumeFile = formData.get("resume");
  if (resumeFile instanceof File && resumeFile.size > 0) {
    const resumePath = await uploadResume(resumeFile);
    if (!resumePath) redirect("/studio/settings?error=invalid-resume");
    const { error } = await admin.from("site_settings").upsert({ id: true, resume_path: resumePath });
    if (error) redirect("/studio/settings?error=save-failed");
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/resume");
  revalidatePath("/studio");
  revalidatePath("/studio/settings");
  redirect("/studio/settings?saved=true");
}

export async function removeResume() {
  await requirePortfolioOwner();
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/settings?error=save-failed");
  const { data: settings } = await admin.from("site_settings").select("resume_path").eq("id", true).maybeSingle();
  if (settings?.resume_path && !settings.resume_path.startsWith("http") && !settings.resume_path.startsWith("/")) await admin.storage.from(ASSETS_BUCKET).remove([settings.resume_path]);
  const { error } = await admin.from("site_settings").upsert({ id: true, resume_path: null });
  if (error) redirect("/studio/settings?error=save-failed");
  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/studio/settings");
  redirect("/studio/settings?resume-removed=true");
}

async function uploadProjectCover(slug: string, file: File) {
  if (!COVER_MIME_TYPES.has(file.type) || file.size > COVER_MAX_BYTES) return null;

  const extension = coverExtension(file.type);
  if (!extension) return null;

  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const path = `projects/${slug}-${Date.now()}.${extension}`;
  const { error } = await admin.storage.from(PORTFOLIO_ASSETS_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });

  return error ? null : path;
}

export async function savePost(formData: FormData) {
  await requirePortfolioOwner();
  const parsed = postSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    body: formData.get("body"),
    tags: formData.get("tags") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) redirect("/studio/posts?error=invalid-post");

  const { id, title, slug, excerpt, body, tags, status } = parsed.data;
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/posts?error=save-failed");
  const payload = {
    title,
    slug: toSlug(slug || title),
    excerpt: excerpt || null,
    body_markdown: body,
    tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const result = id
    ? await admin.from("blog_posts").update(payload).eq("id", id)
    : await admin.from("blog_posts").insert(payload);

  if (result.error) redirect("/studio/posts?error=save-failed");

  revalidatePath("/journal");
  revalidatePath("/");
  revalidatePath("/studio");
  revalidatePath("/studio/posts");
  redirect("/studio/posts?saved=true");
}

export async function deletePost(formData: FormData) {
  await requirePortfolioOwner();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/studio/posts?error=delete-failed");

  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/posts?error=delete-failed");

  const { error } = await admin.from("blog_posts").delete().eq("id", id.data);
  if (error) redirect("/studio/posts?error=delete-failed");

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/studio");
  revalidatePath("/studio/posts");
  redirect("/studio/posts?deleted=true");
}

export async function saveProject(formData: FormData) {
  await requirePortfolioOwner();
  const parsed = projectSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    projectType: formData.get("projectType"),
    year: formData.get("year"),
    summary: formData.get("summary"),
    scope: formData.get("scope") || undefined,
    stack: formData.get("stack") || undefined,
    challenge: formData.get("challenge") || undefined,
    lessons: formData.get("lessons") || undefined,
    liveUrl: formData.get("liveUrl") || "",
    githubUrl: formData.get("githubUrl") || "",
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) {
    console.error("Invalid project form", parsed.error.flatten().fieldErrors);
    redirect("/studio/projects?error=invalid-project");
  }

  const { id, name, slug, projectType, year, summary, scope, stack, challenge, lessons, liveUrl, githubUrl, status, sortOrder } = parsed.data;
  const projectSlug = toSlug(slug || name);
  const coverFile = formData.get("coverImage");
  let coverImagePath: string | undefined;

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploadedPath = await uploadProjectCover(projectSlug, coverFile);
    if (!uploadedPath) redirect("/studio/projects?error=invalid-cover");
    coverImagePath = uploadedPath;
  }

  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/projects?error=save-failed");

  const payload = {
    name,
    slug: projectSlug,
    project_type: projectType,
    year,
    summary,
    scope: scope ? scope.split(",").map((item) => item.trim()).filter(Boolean) : [],
    stack: stack ? stack.split(",").map((item) => item.trim()).filter(Boolean) : [],
    challenge: challenge || null,
    lessons: lessons || null,
    live_url: liveUrl || null,
    github_url: githubUrl || null,
    is_published: status === "published",
    sort_order: sortOrder,
    ...(coverImagePath !== undefined ? { cover_image_path: coverImagePath } : {}),
  };
  const result = id ? await admin.from("projects").update(payload).eq("id", id) : await admin.from("projects").insert(payload);
  if (result.error) {
    console.error("Project save failed", result.error);
    redirect("/studio/projects?error=save-failed");
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/studio");
  revalidatePath("/studio/projects");
  redirect("/studio/projects?saved=true");
}

export async function removeProjectCover(formData: FormData) {
  await requirePortfolioOwner();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/studio/projects?error=save-failed");

  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/projects?error=save-failed");

  const { data: project } = await admin.from("projects").select("cover_image_path").eq("id", id.data).maybeSingle();
  if (!project) redirect("/studio/projects?error=save-failed");

  const storedPath = project.cover_image_path;
  if (storedPath && !storedPath.startsWith("http://") && !storedPath.startsWith("https://") && !storedPath.startsWith("/")) {
    await admin.storage.from(PORTFOLIO_ASSETS_BUCKET).remove([storedPath]);
  }

  const { error } = await admin.from("projects").update({ cover_image_path: null }).eq("id", id.data);
  if (error) redirect(`/studio/projects/${id.data}?error=save-failed`);

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/studio");
  revalidatePath("/studio/projects");
  revalidatePath(`/studio/projects/${id.data}`);
  redirect(`/studio/projects/${id.data}?cover-removed=true`);
}

export async function deleteProject(formData: FormData) {
  await requirePortfolioOwner();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/studio/projects?error=delete-failed");

  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/projects?error=delete-failed");

  const { error } = await admin.from("projects").delete().eq("id", id.data);
  if (error) redirect("/studio/projects?error=delete-failed");

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/studio");
  revalidatePath("/studio/projects");
  redirect("/studio/projects?deleted=true");
}
