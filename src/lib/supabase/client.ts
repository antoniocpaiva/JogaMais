"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase não configurado.");
  return createBrowserClient(config.url, config.publishableKey);
}
