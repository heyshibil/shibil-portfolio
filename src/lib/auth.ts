import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function requirePortfolioOwner() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== supabaseConfig.ownerEmail()) {
    redirect("/studio/login");
  }

  return user;
}
