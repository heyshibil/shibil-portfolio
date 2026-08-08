import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email();

export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;

  async function sendMagicLink(formData: FormData) {
    "use server";
    const parsed = emailSchema.safeParse(formData.get("email"));
    if (!parsed.success) redirect("/studio/login?error=invalid-email");
    if (parsed.data.toLowerCase() !== supabaseConfig.ownerEmail()) redirect("/studio/login?error=not-authorized");

    const headerList = await headers();
    const origin = headerList.get("origin") ?? "http://localhost:3000";
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/studio` },
    });

    if (error) redirect("/studio/login?error=delivery-failed");
    redirect("/studio/login?sent=true");
  }

  return <main className="grid min-h-svh place-items-center px-4"><section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-7 sm:p-9"><p className="eyebrow">Private area</p><h1 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white">Portfolio studio</h1><p className="mt-3 leading-7 text-zinc-400">Enter your owner email to receive a secure sign-in link.</p>{params.sent && <p className="mt-6 rounded-lg border border-emerald-200/30 bg-emerald-200/10 p-3 text-sm text-emerald-100">Check your inbox for the sign-in link.</p>}{params.error && <p className="mt-6 rounded-lg border border-red-200/20 bg-red-200/10 p-3 text-sm text-red-100">This email cannot access the studio.</p>}<form action={sendMagicLink} className="mt-7 grid gap-3"><label className="grid gap-2 text-sm text-zinc-200" htmlFor="email">Email address<input className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-200" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><button className="button-primary justify-center" type="submit">Send sign-in link</button></form></section></main>;
}
