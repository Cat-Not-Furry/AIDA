import { supabase } from "@/lib/supabaseClient";

export function getSupabaseClient() {
	if (!supabase) {
		throw new Error("Supabase client not initialized");
	}
	return supabase;
}

