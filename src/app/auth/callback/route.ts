import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/studio";
  const response = NextResponse.redirect(new URL(safeNext, requestUrl.origin));

  if (!code) return response;

  const supabase = createServerClient(supabaseConfig.url(), supabaseConfig.publishableKey(), {
    cookies: {
      getAll() {
        return request.headers.get("cookie")?.split("; ").map((value) => {
          const [name, ...rest] = value.split("=");
          return { name, value: rest.join("=") };
        }) ?? [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.exchangeCodeForSession(code);
  return response;
}
