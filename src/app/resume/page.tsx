import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings, resolveAssetUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const { resumePath } = await getSiteSettings();
  const resumeUrl = resolveAssetUrl(resumePath);
  return <main><div className="site-shell"><SiteHeader /><section className="py-16 sm:py-24"><Link href="/" className="text-sm text-emerald-100 underline decoration-emerald-100/40 underline-offset-4">← Back home</Link><div className="mt-12 flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow">Resume</p><h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] text-white sm:text-6xl">A closer look at my work.</h1></div>{resumeUrl && <a className="button-primary" href="/resume/download">Download resume</a>}</div>{resumeUrl ? <iframe className="mt-12 h-[75svh] min-h-[32rem] w-full rounded-2xl border border-white/10 bg-white/[0.03]" src={resumeUrl} title="Shibil Mohammed resume" /> : <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-zinc-400">My resume is currently being updated. Please connect with me by email.</div>}</section><SiteFooter /></div></main>;
}
