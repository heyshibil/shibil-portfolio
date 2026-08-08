import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedProjects } from "@/lib/public-projects";

export const metadata: Metadata = { title: "Work | Shibil Mohammed", description: "Selected full-stack and backend-focused work by Shibil Mohammed." };

export const revalidate = 3600;

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return <main><div className="site-shell"><SiteHeader activePath="/work" /><section className="py-20 sm:py-28"><p className="eyebrow">Selected work</p><h1 className="mt-5 max-w-4xl text-balance text-5xl font-medium tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">Products built around real workflows, not just screens.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">I enjoy the work behind the interface: careful architecture, dependable account flows, background processing, data decisions, and the details that make a product hold together.</p></section><section className="section-rule py-8 sm:py-12">{projects.map((project, index) => <article key={project.slug} className="grid gap-5 border-b border-white/10 py-8 last:border-b-0 md:grid-cols-[5rem_1fr_auto] md:items-start sm:py-10"><p className="font-mono text-xs text-emerald-200/70">0{index + 1}</p><div><p className="text-sm text-zinc-500">{project.type} · {project.year}</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl">{project.name}</h2><p className="mt-4 max-w-2xl leading-7 text-zinc-400">{project.description}</p><ul className="mt-5 flex flex-wrap gap-2">{project.details.slice(0, 3).map((detail) => <li key={detail} className="tag">{detail}</li>)}</ul></div><Link href={`/work/${project.slug}`} className="button-secondary w-fit">Case study <span aria-hidden="true">↗</span></Link></article>)}</section><SiteFooter /></div></main>;
}
