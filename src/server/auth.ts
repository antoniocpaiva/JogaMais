import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export type Membership = {
  id: string;
  organization_id: string;
  role: "coordinator" | "coach" | "guardian";
  organizations: { name: string } | { name: string }[] | null;
};

export const getAuthenticatedUserId = cache(async () => {
  if (!hasSupabaseConfig()) redirect("/entrar");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;
  if (error || typeof subject !== "string") redirect("/entrar");
  return subject;
});

export const getMemberships = cache(async (): Promise<Membership[]> => {
  await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("id, organization_id, role, organizations(name)")
    .eq("status", "active")
    .order("created_at");
  if (error) throw new Error("Não foi possível carregar os vínculos ativos.");
  return (data ?? []) as Membership[];
});

export async function requireCoordinator(organizationId: string) {
  await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("role", "coordinator")
    .eq("status", "active")
    .single();
  if (error || !data) throw new Error("Ação permitida somente a coordenadores ativos.");
  return { supabase, membershipId: data.id as string };
}

export function organizationName(membership: Membership) {
  const organization = Array.isArray(membership.organizations)
    ? membership.organizations[0]
    : membership.organizations;
  return organization?.name ?? "Organização";
}
