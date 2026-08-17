import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePortfolioOwner } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { removeResume, saveSiteSettings } from "@/lib/studio-actions";
import { resolveAssetUrl } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requirePortfolioOwner();
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/studio/login");
  const [{ data: experience }, { data: settings }] = await Promise.all([
    admin?.from("experiences").select("id, role, organization, location, description").is("ended_on", null).order("sort_order").limit(1).maybeSingle(),
    admin?.from("site_settings").select("resume_path").eq("id", true).maybeSingle(),
  ]);
  const query = await searchParams;
  const resumeUrl = resolveAssetUrl(settings?.resume_path);
  return <main className="min-h-svh"><div className="site-shell max-w-3xl py-8 sm:py-10"><div className="flex items-center justify-between border-b border-white/10 pb-6"><div><p className="eyebrow">Private dashboard</p><h1 className="mt-2 text-2xl font-medium text-white">Site settings</h1></div><Link className="button-secondary" href="/studio">Dashboard</Link></div>{query.saved && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Settings saved.</p>}{query["resume-removed"] && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Resume removed.</p>}{query.error && <p className="mt-6 rounded-lg border border-red-200/20 bg-red-200/10 p-3 text-sm text-red-100">Please check the fields and try again.</p>}<form action={saveSiteSettings} className="mt-10 grid gap-6"><label className="grid gap-2 text-sm text-zinc-200">Current role<input className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white" name="role" defaultValue={experience?.role ?? "Full Stack Developer"} required /></label><label className="grid gap-2 text-sm text-zinc-200">Company name<input className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white" name="organization" defaultValue={experience?.organization ?? "Bridgeon Solutions LLP"} required /></label><label className="grid gap-2 text-sm text-zinc-200">Location<input className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white" name="location" defaultValue={experience?.location ?? "Calicut, Kerala"} /></label><label className="grid gap-2 text-sm text-zinc-200">Short description<textarea className="min-h-28 rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white" name="description" defaultValue={experience?.description ?? "Always open to an interesting conversation."} required /></label><label className="grid gap-2 text-sm text-zinc-200">Resume PDF<span className="text-zinc-500">Upload a PDF up to 8 MB. A new upload replaces the current resume.</span><input className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white" name="resume" type="file" accept="application/pdf" /></label><button className="button-primary w-fit" type="submit">Save settings</button></form>{resumeUrl && <div className="mt-8 flex flex-wrap items-center gap-4"><a className="text-sm text-emerald-100 underline" href="/resume" target="_blank" rel="noreferrer">Preview current resume</a><form action={removeResume}><button className="button-secondary border-red-200/30 text-red-100" type="submit">Remove resume</button></form></div>}</div></main>;
}
