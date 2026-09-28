"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId, requireCoordinator } from "@/server/auth";

const id = z.uuid();
const organizationSchema = z.object({ name: z.string().trim().min(2).max(120) });
const seasonSchema = z.object({
  organizationId: id,
  name: z.string().trim().min(2).max(80),
  startsOn: z.iso.date(),
  endsOn: z.iso.date(),
}).refine((value) => value.endsOn >= value.startsOn, { message: "A data final deve ser posterior à inicial." });
const teamSchema = z.object({
  organizationId: id,
  seasonId: id,
  name: z.string().trim().min(2).max(80),
  ageCategory: z.string().trim().min(2).max(40),
});
const athleteSchema = z.object({
  organizationId: id,
  teamId: id,
  displayName: z.string().trim().min(2).max(120),
  birthDate: z.union([z.iso.date(), z.literal("")]),
  preferredPosition: z.string().trim().max(60),
});
const coachSchema = z.object({ organizationId: id, teamId: id, membershipId: id });
const guardianSchema = z.object({
  organizationId: id,
  athleteId: id,
  membershipId: id,
  relationship: z.string().trim().min(2).max(40),
});
const revokeSchema = z.object({ organizationId: id, recordId: id, kind: z.enum(["coach", "guardian"]) });

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

async function failOnError(error: { message: string } | null, message: string) {
  if (error) throw new Error(`${message} ${error.message}`);
}

export async function bootstrapOrganization(formData: FormData) {
  await getAuthenticatedUserId();
  const input = organizationSchema.parse(values(formData));
  const supabase = await createClient();
  const { error } = await supabase.rpc("bootstrap_organization", { organization_name: input.name });
  await failOnError(error, "Não foi possível criar a organização.");
  redirect("/app/configuracoes");
}

export async function createSeason(formData: FormData) {
  const input = seasonSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const { error } = await supabase.from("seasons").insert({
    organization_id: input.organizationId,
    name: input.name,
    starts_on: input.startsOn,
    ends_on: input.endsOn,
  });
  await failOnError(error, "Não foi possível criar a temporada.");
  revalidatePath("/app/configuracoes");
}

export async function createTeam(formData: FormData) {
  const input = teamSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const { error } = await supabase.from("teams").insert({
    organization_id: input.organizationId,
    season_id: input.seasonId,
    name: input.name,
    age_category: input.ageCategory,
  });
  await failOnError(error, "Não foi possível criar a turma.");
  revalidatePath("/app/configuracoes");
}

export async function createAthlete(formData: FormData) {
  const input = athleteSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const { data, error } = await supabase.rpc("create_athlete_with_team", {
    target_organization_id: input.organizationId,
    target_team_id: input.teamId,
    athlete_display_name: input.displayName,
    athlete_birth_date: input.birthDate || null,
    athlete_preferred_position: input.preferredPosition || null,
  });
  await failOnError(error, "Não foi possível criar o atleta.");
  if (!data) throw new Error("Atleta não retornado pelo banco.");
  revalidatePath("/app/configuracoes");
}

export async function assignCoach(formData: FormData) {
  const input = coachSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const { error } = await supabase.from("team_coaches").insert({
    organization_id: input.organizationId,
    team_id: input.teamId,
    membership_id: input.membershipId,
  });
  await failOnError(error, "Não foi possível atribuir o técnico.");
  revalidatePath("/app/configuracoes");
}

export async function linkGuardian(formData: FormData) {
  const input = guardianSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const { error } = await supabase.from("guardian_athletes").insert({
    organization_id: input.organizationId,
    guardian_membership_id: input.membershipId,
    athlete_id: input.athleteId,
    relationship: input.relationship,
  });
  await failOnError(error, "Não foi possível vincular o responsável.");
  revalidatePath("/app/configuracoes");
}

export async function revokeAccess(formData: FormData) {
  const input = revokeSchema.parse(values(formData));
  const { supabase } = await requireCoordinator(input.organizationId);
  const table = input.kind === "coach" ? "team_coaches" : "guardian_athletes";
  const revocation = input.kind === "coach"
    ? { status: "inactive", active_until: new Date().toISOString().slice(0, 10) }
    : { status: "inactive", revoked_at: new Date().toISOString() };
  const { error } = await supabase.from(table).update(revocation).eq("id", input.recordId).eq("organization_id", input.organizationId);
  await failOnError(error, "Não foi possível revogar o acesso.");
  revalidatePath("/app/configuracoes");
}
