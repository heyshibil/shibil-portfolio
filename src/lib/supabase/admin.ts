import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

export function createSupabaseAdminClient() {
  return createClient(supabaseConfig.url(), supabaseConfig.secretKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
