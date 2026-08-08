"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

  const { error } = await createSupabaseAdminClient().from("blog_posts").delete().eq("id", id.data);
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
  const payload = {
    name,
    slug: toSlug(slug || name),
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
  };
  const result = id ? await createSupabaseAdminClient().from("projects").update(payload).eq("id", id) : await createSupabaseAdminClient().from("projects").insert(payload);
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

export async function deleteProject(formData: FormData) {
  await requirePortfolioOwner();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/studio/projects?error=delete-failed");

  const { error } = await createSupabaseAdminClient().from("projects").delete().eq("id", id.data);
  if (error) redirect("/studio/projects?error=delete-failed");

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/studio");
  revalidatePath("/studio/projects");
  redirect("/studio/projects?deleted=true");
}
