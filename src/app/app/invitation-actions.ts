"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { requireCoordinator } from "@/server/auth";

export type InvitationState = { error?: string; inviteUrl?: string };

const schema = z.object({
  organizationId: z.uuid(),
  email: z.email().transform((email) => email.trim().toLowerCase()),
  role: z.enum(["coach", "guardian"]),
});

export async function issueInvitation(_: InvitationState, formData: FormData): Promise<InvitationState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Revise o e-mail e o papel selecionado." };
  const { supabase } = await requireCoordinator(parsed.data.organizationId);
  const { data, error } = await supabase.rpc("issue_invitation", {
    target_organization_id: parsed.data.organizationId,
    invited_email: parsed.data.email,
    invited_role: parsed.data.role,
  });
  if (error || !Array.isArray(data) || !data[0]?.invitation_token) return { error: "Não foi possível gerar o convite." };
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? `http://${headerStore.get("host") ?? "localhost:3000"}`;
  return { inviteUrl: `${origin}/convite/${data[0].invitation_token}` };
}
