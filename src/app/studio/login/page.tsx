import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email();

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; reason?: string }>;
}) {
  const params = await searchParams;

  async function sendMagicLink(formData: FormData) {
    "use server";
    const parsed = emailSchema.safeParse(formData.get("email"));
    if (!parsed.success) {
      redirect("/studio/login?error=invalid-email");
    }

    const ownerEmail = supabaseConfig.ownerEmail();
    if (ownerEmail && parsed.data.toLowerCase() !== ownerEmail) {
      console.warn(
        `[Studio Auth] Unauthorized attempt: ${parsed.data}. Expected: ${ownerEmail}`
      );
      redirect("/studio/login?error=not-authorized");
    }

    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
    const proto = headerList.get("x-forwarded-proto") ?? "http";
    const requestOrigin = headerList.get("origin") ?? `${proto}://${host}`;
    const origin = process.env.NEXT_PUBLIC_SITE_URL?.trim() || requestOrigin;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/studio`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("[Studio Auth] Supabase OTP send failed:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });

      const isRateLimit =
        error.status === 429 ||
        error.message.toLowerCase().includes("rate limit") ||
        error.message.toLowerCase().includes("over_email_send_rate_limit");
      const isSupabaseTimeout = error.status === 521 || error.status === 522 || error.message.toLowerCase().includes("fetch failed");

      const errorCode = isRateLimit ? "rate-limit" : isSupabaseTimeout ? "supabase-timeout" : "delivery-failed";
      redirect(`/studio/login?error=${errorCode}&reason=${encodeURIComponent(error.message)}`);
    }

    redirect("/studio/login?sent=true");
  }

  function getErrorMessage() {
    if (!params.error) return null;
    if (params.error === "invalid-email") {
      return "Please enter a valid email address.";
    }
    if (params.error === "not-authorized") {
      return "This email cannot access the studio. Only the portfolio owner email is authorized.";
    }
    if (params.error === "rate-limit") {
      return "Supabase email rate limit reached (3 emails/hour limit on default provider). Please wait before retrying or configure custom SMTP in Supabase.";
    }
    if (params.error === "delivery-failed") {
      return params.reason
        ? `Delivery failed: ${params.reason}. Verify your Supabase Auth Email settings and redirect URLs.`
        : "Failed to send magic link. Ensure the Supabase Email provider is enabled in your project dashboard.";
    }
    if (params.error === "supabase-timeout") {
      return "Supabase Auth temporarily timed out while sending the link. The project configuration is valid; restart the dev server and retry in a moment.";
    }
    return "An error occurred while attempting to sign in. Please try again.";
  }

  const errorMessage = getErrorMessage();

  return (
    <main className="grid min-h-svh place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
        <p className="eyebrow">Private area</p>
        <h1 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white">
          Portfolio studio
        </h1>
        <p className="mt-3 leading-7 text-zinc-400">
          Enter your owner email to receive a secure sign-in link.
        </p>

        {params.sent && (
          <div className="mt-6 rounded-xl border border-emerald-200/30 bg-emerald-200/10 p-4 text-sm text-emerald-100 leading-relaxed">
            <p className="font-medium text-emerald-200">Magic link dispatched!</p>
            <p className="mt-1 text-emerald-100/90 text-xs">
              Check your inbox (and spam folder) for the verification email to sign in.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-200/20 bg-red-200/10 p-4 text-sm text-red-100 leading-relaxed">
            <p className="font-medium text-red-200">Sign-in Notice</p>
            <p className="mt-1 text-red-200/90 text-xs">{errorMessage}</p>
          </div>
        )}

        <form action={sendMagicLink} className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm text-zinc-200" htmlFor="email">
            Email address
            <input
              className="rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-200"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <button className="button-primary justify-center cursor-pointer" type="submit">
            Send sign-in link
          </button>
        </form>
      </section>
    </main>
  );
}
