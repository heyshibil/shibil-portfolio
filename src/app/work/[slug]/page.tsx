import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProjectGallery } from "@/components/project-gallery";
import { getPublishedProject } from "@/lib/public-projects";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  return project ? { title: `${project.name} | Shibil Mohammed`, description: project.description } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();

  return <main><div className="site-shell"><SiteHeader activePath="/work" /><article className="py-16 sm:py-24">
    <Link href="/work" className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4">← All work</Link>
    <p className="eyebrow mt-12">{project.type} · {project.year}</p>
    <h1 className="mt-5 text-5xl font-medium tracking-[-0.06em] text-white sm:text-7xl">{project.name}</h1>
    <p className="mt-7 max-w-3xl text-xl leading-8 text-zinc-300 sm:text-2xl">{project.description}</p>
    <ProjectGallery images={project.gallery ?? []} projectName={project.name} />
    <div className="mt-10 flex flex-wrap gap-3">{project.liveHref && <a className="button-primary" href={project.liveHref} target="_blank" rel="noreferrer">View live product ↗</a>}{project.githubHref && <a className="button-secondary" href={project.githubHref} target="_blank" rel="noreferrer">Source code ↗</a>}</div>
    <div className="mt-20 grid gap-12 border-t border-white/10 pt-10 md:grid-cols-[12rem_1fr]"><p className="eyebrow">Scope</p><ul className="flex flex-wrap gap-2">{project.details.map((detail) => <li key={detail} className="tag">{detail}</li>)}</ul><p className="eyebrow">The engineering challenge</p><p className="max-w-2xl text-lg leading-8 text-zinc-300">{project.challenge}</p><p className="eyebrow">Technology</p><ul className="flex flex-wrap gap-2">{project.stack.map((item) => <li key={item} className="tag">{item}</li>)}</ul><p className="eyebrow">What I learned</p><p className="max-w-2xl text-lg leading-8 text-zinc-300">{project.lessons}</p></div>
  </article><SiteFooter /></div></main>;
}
