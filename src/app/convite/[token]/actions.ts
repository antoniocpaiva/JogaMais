"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId } from "@/server/auth";

export async function acceptInvitation(token: string) {
  await getAuthenticatedUserId();
  const validToken = z.string().regex(/^[a-f0-9]{48}$/).parse(token);
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_invitation", { invitation_token: validToken });
  if (error) throw new Error("O convite é inválido, expirou ou pertence a outro e-mail.");
  redirect("/app");
}
