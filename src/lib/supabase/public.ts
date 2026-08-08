import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

export function createSupabasePublicClient() {
  return createClient(supabaseConfig.url(), supabaseConfig.publishableKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
