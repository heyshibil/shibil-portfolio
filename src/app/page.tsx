import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { getPublishedProjects } from "@/lib/public-projects";

export const revalidate = 3600;

const cardAccents = ["emerald", "amber", "sky"] as const;

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
        <SiteHeader activePath="/" />

        {/* ── Hero ──────────────────────────────────────── */}
        <section id="top" className="relative grid min-h-[calc(100svh-76px)] items-end py-16 sm:py-20 lg:py-24">
          <div className="animate-breathe pointer-events-none absolute inset-x-0 top-16 -z-10 h-96 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.18),transparent_68%)] blur-2xl" />
          <div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className="eyebrow mb-7 animate-in animate-delay-1">Full-stack developer · Kerala, India</p>
              <h1 className="animate-in animate-delay-2 max-w-5xl text-balance text-5xl font-medium tracking-[-0.065em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                I build products from the <span className="text-emerald-200">problem up.</span>
              </h1>
              <p className="animate-in animate-delay-3 mt-8 max-w-2xl text-pretty text-lg leading-8 text-zinc-300 sm:text-xl">
                I&apos;m Shibil Mohammed, a full-stack developer who turns complex ideas into dependable web applications and backend systems.
              </p>
              <div className="animate-in animate-delay-4 mt-9 flex flex-wrap gap-3">
                <Link className="button-primary" href="/work">Explore selected work <ArrowUpRight /></Link>
                <a className="button-secondary" href="mailto:shibzzmohd@gmail.com">Email me <ArrowUpRight /></a>
              </div>
            </div>
            <p className="animate-in animate-delay-5 border-l border-emerald-200/40 pl-5 text-sm leading-6 text-zinc-400">
              Currently a Full Stack Developer at Bridgeon Solutions LLP. Always open to an interesting conversation.
            </p>
          </div>
        </section>

        {/* ── Selected Work ─────────────────────────────── */}
        <section id="work" className="section-rule-short relative py-20 sm:py-28">
          <SectionHeading eyebrow="01 / Selected work">
            Products that ask more than a simple interface can answer.
          </SectionHeading>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <article
                key={project.name}
                className={`project-card group animate-in animate-delay-${index + 5}`}
                data-accent={cardAccents[index % cardAccents.length]}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="project-index font-mono text-xs">{String(index + 1).padStart(2, "0")}</p>
                  <Link className="project-link" href={`/work/${project.slug}`} aria-label={`Read ${project.name} case study`}>
                    <ArrowUpRight />
                  </Link>
                </div>
                <div className="mt-10">
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

        {/* ── How I Work ────────────────────────────────── */}
        <section id="about" className="relative isolate py-24 sm:py-32">
          {/* Full-width dotted grid background spanning screen edge to edge across entire section */}
          <div className="workspace-dotted-bg pointer-events-none absolute inset-y-0 left-[50%] -translate-x-[50%] w-[100vw] -z-20" />

          {/* Smooth radial dark glow behind heading text to clear dots directly behind text while keeping dots around it */}
          <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 w-[90%] max-w-4xl h-72 -z-10 bg-[radial-gradient(ellipse_at_center,#111417_40%,transparent_75%)] blur-md" />

          <div className="relative text-center max-w-3xl mx-auto px-4">
            <p className="eyebrow mb-3">02 / How I work</p>
            <h2 className="text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl md:text-5xl">
              How I approach a problem
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A simple, repeatable path I follow to move from a fuzzy problem to a working solution.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3 relative">
              {[
                {
                  step: "01",
                  title: "Understand",
                  subtitle: "Frame the problem",
                  icon: (
                    <svg className="size-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  ),
                  bullets: [
                    "Clarify the goal and who it's for",
                    "Gather context, constraints & data",
                    "Define what success looks like",
                  ],
                },
                {
                  step: "02",
                  title: "Explore",
                  subtitle: "Find the approach",
                  icon: (
                    <svg className="size-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3a7 7 0 00-7 7c0 2.36 1.134 4.455 2.9 5.786V18a1 1 0 001 1h6a1 1 0 001-1v-2.214C17.866 14.455 19 12.36 19 10a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  bullets: [
                    "Break the problem into smaller parts",
                    "Sketch options and weigh trade-offs",
                    "Prototype the most promising path",
                  ],
                },
                {
                  step: "03",
                  title: "Deliver",
                  subtitle: "Ship the solution",
                  icon: (
                    <svg className="size-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 5.39a3 3 0 106 0c0-.859-.36-1.637-.938-2.186" />
                    </svg>
                  ),
                  bullets: [
                    "Build, test, and refine iteratively",
                    "Validate against the success criteria",
                    "Ship, measure, and learn from results",
                  ],
                },
              ].map((step, index, arr) => (
                <div key={step.title} className="relative flex flex-col">
                  {/* Horizontal connector on Desktop (spans strictly inside the 32px grid gap between cards) */}
                  {index < arr.length - 1 && (
                    <div className="hidden lg:flex absolute left-full top-1/2 -translate-y-1/2 items-center justify-between w-8 z-20 pointer-events-none">
                      <div className="size-3.5 rounded-full border border-rose-500/50 bg-[#141816] shadow-[0_0_8px_rgba(244,63,94,0.3)] shrink-0 -ml-1.5" />
                      <div className="w-full border-b-2 border-dotted border-rose-400/80" />
                      <div className="size-3.5 rounded-full border border-rose-500/50 bg-[#141816] shadow-[0_0_8px_rgba(244,63,94,0.3)] shrink-0 -mr-1.5" />
                    </div>
                  )}

                  <article className="h-full rounded-2xl border border-white/10 bg-[#141816]/90 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 hover:border-white/20 hover:bg-[#181d1a]">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-950/30 shadow-[0_0_12px_rgba(244,63,94,0.1)]">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">{step.title}</h3>
                          <p className="text-xs text-zinc-400 mt-0.5">{step.subtitle}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-zinc-500">{step.step}</span>
                    </div>

                    {/* Divider */}
                    <div className="my-5 border-t border-white/10" />

                    {/* Bullet points */}
                    <ul className="space-y-3">
                      {step.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose-400/80 shadow-[0_0_6px_rgba(244,63,94,0.4)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>

                  {/* Vertical connector on Mobile (spans in vertical gap between stacked cards) */}
                  {index < arr.length - 1 && (
                    <div className="flex lg:hidden justify-center items-center py-2 z-20 pointer-events-none">
                      <div className="flex flex-col items-center">
                        <div className="size-3.5 rounded-full border border-rose-500/50 bg-[#141816] shadow-[0_0_8px_rgba(244,63,94,0.3)] shrink-0 -mt-1.5" />
                        <div className="h-6 border-l-2 border-dotted border-rose-400/80 my-0.5" />
                        <div className="size-3.5 rounded-full border border-rose-500/50 bg-[#141816] shadow-[0_0_8px_rgba(244,63,94,0.3)] shrink-0 -mb-1.5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </section>

        {/* ── Field Notes ───────────────────────────────── */}
        <section id="journal" className="section-rule-gradient relative py-20 sm:py-28">
          <SectionHeading eyebrow="03 / Field notes">
            A space for the things I&apos;m learning about life, work, and becoming better.
          </SectionHeading>
          <div className="mt-12 rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(110,231,183,0.09),rgba(255,255,255,0.02)_42%)] p-7 sm:p-10">
            {latestPost ? <><p className="eyebrow">Latest note</p><h3 className="mt-4 max-w-2xl text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl"><Link className="transition hover:text-emerald-100" href={`/journal/${latestPost.slug}`}>{latestPost.title}</Link></h3>{latestPost.excerpt && <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{latestPost.excerpt}</p>}<p className="mt-5 text-sm text-emerald-100/80">{latestPost.tags?.join(" · ")}</p><div className="mt-7 flex flex-wrap gap-4"><Link className="button-primary" href={`/journal/${latestPost.slug}`}>Read note <ArrowUpRight /></Link><Link className="button-secondary" href="/journal">More notes →</Link></div></> : <><p className="max-w-2xl text-xl leading-8 text-zinc-200 sm:text-2xl">The journal is ready for the quieter parts of the journey—not just what I build, but what I notice along the way.</p><Link className="mt-7 inline-flex text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4" href="/journal">Visit the journal →</Link></>}
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────── */}
        <section id="contact" className="relative py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.08),transparent_70%)] blur-2xl" />
          <p className="eyebrow">04 / Contact</p>
          <h2 className="mt-5 max-w-4xl text-balance text-4xl font-medium tracking-[-0.055em] text-white sm:text-5xl md:text-6xl">
            Building something meaningful? I&apos;d like to hear about it.
          </h2>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <a className="contact-link" href="mailto:shibzzmohd@gmail.com">
              Email <span className="contact-link-arrow"><ArrowUpRight /></span>
            </a>
            <a className="contact-link" href="https://www.linkedin.com/in/shibil-mohammed0770/" target="_blank" rel="noreferrer">
              LinkedIn <span className="contact-link-arrow"><ArrowUpRight /></span>
            </a>
            <a className="contact-link" href="https://github.com/heyshibil" target="_blank" rel="noreferrer">
              GitHub <span className="contact-link-arrow"><ArrowUpRight /></span>
            </a>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
