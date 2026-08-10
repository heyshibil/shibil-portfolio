import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

export function createSupabasePublicClient() {
  if (!supabaseConfig.hasPublicConfig()) {
    return null;
  }

  return createClient(supabaseConfig.url(), supabaseConfig.publishableKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
