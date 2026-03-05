import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const SUPABASE_CONFIG_ERROR =
  "Supabase client not initialized. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

if (!isSupabaseConfigured) {
  console.warn("Supabase URL or ANON KEY not provided. Client will be uninitialized.");
}

const unconfiguredClient = new Proxy({} as ReturnType<typeof createClient>, {
  get() {
    throw new Error(SUPABASE_CONFIG_ERROR);
  },
});

export const supabase =
  isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : unconfiguredClient;
