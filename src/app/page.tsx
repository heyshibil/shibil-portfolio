import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { getPublishedProjects } from "@/lib/public-projects";

export const revalidate = 3600;

const projectAccents = ["from-emerald-300/20 via-emerald-300/5 to-transparent", "from-amber-200/20 via-amber-200/5 to-transparent", "from-sky-200/20 via-sky-200/5 to-transparent"];

function ArrowUpRight() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:gap-8">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl md:text-5xl">
        {children}
      </h2>
    </div>
  );
}

export default async function Home() {
  const supabase = createSupabasePublicClient();
  const [{ data: latestPost }, projects] = await Promise.all([supabase.from("blog_posts").select("title, slug, excerpt, tags, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(), getPublishedProjects()]);
  return (
    <main className="overflow-hidden">
      <div className="site-shell">
        <SiteHeader />

        <section id="top" className="relative grid min-h-[calc(100svh-76px)] items-end py-16 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-80 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.13),transparent_68%)] blur-2xl" />
          <div className="grid gap-12 lg:grid-cols-[1fr_14rem] lg:items-end">
            <div>
              <p className="eyebrow mb-7">Full-stack developer · Kerala, India</p>
              <h1 className="max-w-5xl text-balance text-5xl font-medium tracking-[-0.065em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                I build products from the <span className="text-emerald-200">problem up.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-zinc-300 sm:text-xl">
                I&apos;m Shibil Mohammed, a full-stack developer who turns complex ideas into dependable web applications and backend systems.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="button-primary" href="/work">Explore selected work <ArrowUpRight /></Link>
                <a className="button-secondary" href="mailto:shibzzmohd@gmail.com">Email me <ArrowUpRight /></a>
              </div>
            </div>
            <p className="border-l border-emerald-200/40 pl-4 text-sm leading-6 text-zinc-400">
              Currently a Full Stack Developer at Bridgeon Solutions LLP. Always open to an interesting conversation.
            </p>
          </div>
        </section>

        <section id="work" className="section-rule py-20 sm:py-28">
          <SectionHeading eyebrow="01 / Selected work">
            Products that ask more than a simple interface can answer.
          </SectionHeading>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <article key={project.name} className="project-card group">
                <div className={`absolute inset-0 -z-10 bg-gradient-to-b ${projectAccents[index % projectAccents.length]} opacity-0 transition duration-500 group-hover:opacity-100`} />
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs text-zinc-500">0{index + 1}</p>
                  <Link className="project-link" href={`/work/${project.slug}`} aria-label={`Read ${project.name} case study`}>
                    <ArrowUpRight />
                  </Link>
                </div>
                <div className="mt-20">
                  <p className="text-sm text-emerald-100/80">{project.type}</p>
                  <h3 className="mt-2 text-3xl font-medium tracking-[-0.045em] text-white">{project.name}</h3>
                  <p className="mt-4 leading-7 text-zinc-400">{project.description}</p>
                </div>
                <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${project.name} highlights`}>
                  {project.details.map((detail) => <li key={detail} className="tag">{detail}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section-rule py-20 sm:py-28">
          <SectionHeading eyebrow="02 / How I work">
            I make large problems small enough to understand, validate, and connect.
          </SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Understand", "I start by finding the real problem, not rushing toward a familiar solution."],
              ["Build deliberately", "I separate systems into focused parts so each decision is clear and each layer can be tested."],
              ["Take ownership", "I care about the work after it ships: reliability, communication, details, and what comes next."],
            ].map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
                <span className="font-mono text-xs text-emerald-200/70">0{index + 1}</span>
                <h3 className="mt-12 text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="journal" className="section-rule py-20 sm:py-28">
          <SectionHeading eyebrow="03 / Field notes">
            A space for the things I&apos;m learning about life, work, and becoming better.
          </SectionHeading>
          <div className="mt-12 rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(110,231,183,0.09),rgba(255,255,255,0.02)_42%)] p-7 sm:p-10">
            {latestPost ? <><p className="eyebrow">Latest note</p><h3 className="mt-4 max-w-2xl text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl"><Link className="transition hover:text-emerald-100" href={`/journal/${latestPost.slug}`}>{latestPost.title}</Link></h3>{latestPost.excerpt && <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{latestPost.excerpt}</p>}<p className="mt-5 text-sm text-emerald-100/80">{latestPost.tags?.join(" · ")}</p><div className="mt-7 flex flex-wrap gap-4"><Link className="button-primary" href={`/journal/${latestPost.slug}`}>Read note <ArrowUpRight /></Link><Link className="button-secondary" href="/journal">More notes →</Link></div></> : <><p className="max-w-2xl text-xl leading-8 text-zinc-200 sm:text-2xl">The journal is ready for the quieter parts of the journey—not just what I build, but what I notice along the way.</p><Link className="mt-7 inline-flex text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/journal">Visit the journal →</Link></>}
          </div>
        </section>

        <section id="contact" className="section-rule py-20 sm:py-28">
          <p className="eyebrow">04 / Contact</p>
          <h2 className="mt-5 max-w-4xl text-balance text-4xl font-medium tracking-[-0.055em] text-white sm:text-5xl md:text-6xl">
            Building something meaningful? I&apos;d like to hear about it.
          </h2>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 text-lg">
            <a className="contact-link" href="mailto:shibzzmohd@gmail.com">Email <ArrowUpRight /></a>
            <a className="contact-link" href="https://www.linkedin.com/in/shibil-mohammed0770/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
            <a className="contact-link" href="https://github.com/heyshibil" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
