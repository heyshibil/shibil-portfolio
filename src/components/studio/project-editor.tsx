import Link from "next/link";
import Image from "next/image";
import { saveProject, removeProjectCover, removeProjectGalleryImage } from "@/lib/studio-actions";
import { DEFAULT_PROJECT_COVER, PROJECT_COVER_MAX_SIZE_LABEL, PROJECT_GALLERY_MAX_SIZE_LABEL, resolveProjectCoverSrc } from "@/lib/project-cover";

type Project = {
  id?: string;
  name?: string;
  slug?: string;
  project_type?: string;
  year?: number;
  summary?: string;
  scope?: string[];
  stack?: string[];
  challenge?: string | null;
  lessons?: string | null;
  live_url?: string | null;
  github_url?: string | null;
  is_published?: boolean;
  sort_order?: number;
  cover_image_path?: string | null;
  project_gallery?: { id: string; image_path: string; alt_text: string; sort_order: number }[];
};

export function ProjectEditor({ project = {} }: { project?: Project }) {
  const inputClass =
    "rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-200";
  const coverPreviewSrc = project.cover_image_path
    ? resolveProjectCoverSrc(project.cover_image_path)
    : DEFAULT_PROJECT_COVER;

  return (
    <form action={saveProject} className="grid gap-6">
      <input type="hidden" name="id" value={project.id ?? ""} />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-200">
          Project name
          <input className={inputClass} name="name" defaultValue={project.name} required maxLength={80} />
        </label>
        <label className="grid gap-2 text-sm text-zinc-200">
          Project type
          <input
            className={inputClass}
            name="projectType"
            defaultValue={project.project_type}
            required
            placeholder="Full-stack platform"
            maxLength={120}
          />
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <label className="grid gap-2 text-sm text-zinc-200">
          URL slug
          <input className={inputClass} name="slug" defaultValue={project.slug} placeholder="ascend" maxLength={120} />
        </label>
        <label className="grid gap-2 text-sm text-zinc-200">
          Year
          <input
            className={inputClass}
            name="year"
            type="number"
            min="2000"
            max="2100"
            defaultValue={project.year ?? new Date().getFullYear()}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-zinc-200">
          Order
          <input
            className={inputClass}
            name="sortOrder"
            type="number"
            min="0"
            max="999"
            defaultValue={project.sort_order ?? 0}
            required
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-zinc-200">
        Summary
        <textarea className={inputClass} name="summary" defaultValue={project.summary} rows={4} required maxLength={600} />
      </label>
      <label className="grid gap-2 text-sm text-zinc-200">
        Scope <span className="text-zinc-500">Separate with commas.</span>
        <input
          className={inputClass}
          name="scope"
          defaultValue={project.scope?.join(", ")}
          placeholder="50+ REST endpoints, AWS Lambda"
        />
      </label>
      <label className="grid gap-2 text-sm text-zinc-200">
        Technology stack <span className="text-zinc-500">Separate with commas.</span>
        <input
          className={inputClass}
          name="stack"
          defaultValue={project.stack?.join(", ")}
          placeholder="TypeScript, Node.js, PostgreSQL"
        />
      </label>
      <label className="grid gap-2 text-sm text-zinc-200">
        Engineering challenge
        <textarea className={inputClass} name="challenge" defaultValue={project.challenge ?? ""} rows={5} />
      </label>
      <label className="grid gap-2 text-sm text-zinc-200">
        What you learned
        <textarea className={inputClass} name="lessons" defaultValue={project.lessons ?? ""} rows={5} />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-200">
          Live URL
          <input className={inputClass} name="liveUrl" type="url" defaultValue={project.live_url ?? ""} placeholder="https://" />
        </label>
        <label className="grid gap-2 text-sm text-zinc-200">
          GitHub URL
          <input className={inputClass} name="githubUrl" type="url" defaultValue={project.github_url ?? ""} placeholder="https://" />
        </label>
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-zinc-200">
          Cover image{" "}
          <span className="text-zinc-500">Home page project cards. PNG, JPG, or WebP up to {PROJECT_COVER_MAX_SIZE_LABEL}. Leave empty to keep the current image.</span>
        </p>
        <div className="overflow-hidden rounded-xl border border-white/15 bg-zinc-950/80">
          <Image src={coverPreviewSrc} alt="" width={640} height={400} className="h-auto w-full object-cover" />
        </div>
        <input className={inputClass} name="coverImage" type="file" accept="image/png,image/jpeg,image/webp" />
        {project.id && project.cover_image_path ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="button-secondary border-red-200/30 text-red-100 hover:border-red-200/60 hover:bg-red-200/10"
              type="submit"
              formAction={removeProjectCover}
              formNoValidate
            >
              Remove cover
            </button>
            <p className="text-sm text-zinc-500">Uses the default cover on the home page.</p>
          </div>
        ) : null}
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-zinc-200">Project screenshots <span className="text-zinc-500">Add at least 6 screenshots for the case-study carousel. PNG, JPG, or WebP up to {PROJECT_GALLERY_MAX_SIZE_LABEL}.</span></p>
        {project.project_gallery?.length ? <div className="grid gap-3 sm:grid-cols-2"><p className="sm:col-span-2 text-sm text-zinc-500">Current screenshots: {project.project_gallery.length}</p>{project.project_gallery.map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950"><Image src={resolveProjectCoverSrc(image.image_path)} alt={image.alt_text} width={640} height={400} className="aspect-video w-full object-cover" /><div className="flex items-center justify-between gap-3 p-3"><span className="truncate text-xs text-zinc-500">{image.alt_text}</span><button className="button-secondary border-red-200/30 px-3 py-1.5 text-xs text-red-100" type="submit" formAction={removeProjectGalleryImage} formNoValidate name="imageId" value={image.id}>Remove</button></div></div>)}</div> : <p className="text-sm text-zinc-500">No screenshots added yet.</p>}
        <input className={inputClass} name="galleryImages" type="file" accept="image/png,image/jpeg,image/webp" multiple minLength={6} />
        <p className="text-xs text-zinc-600">You can select multiple files at once. New screenshots are appended to the existing gallery.</p>
      </div>
      <label className="grid gap-2 text-sm text-zinc-200">
        Visibility
        <select className={inputClass} name="status" defaultValue={project.is_published ? "published" : "draft"}>
          <option value="draft">Save as draft</option>
          <option value="published">Publish now</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="button-primary" type="submit">
          Save project
        </button>
        <Link className="button-secondary" href="/studio/projects">
          Cancel
        </Link>
      </div>
    </form>
  );
}
