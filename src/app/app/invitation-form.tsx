"use client";

import { useActionState } from "react";
import { issueInvitation, type InvitationState } from "@/app/app/invitation-actions";

const initialState: InvitationState = {};

export function InvitationForm({ organizationId }: { organizationId: string }) {
  const [state, action, pending] = useActionState(issueInvitation, initialState);
  return (
    <div>
      <form action={action} className="m2-inline-form">
        <input name="organizationId" type="hidden" value={organizationId} />
        <label>E-mail<input name="email" required type="email" /></label>
        <label>Papel<select name="role" required><option value="coach">Técnico</option><option value="guardian">Responsável</option></select></label>
        <button className="button button-primary" disabled={pending} type="submit">{pending ? "Gerando…" : "Gerar convite"}</button>
      </form>
      {state.error && <p aria-live="polite" className="form-error">{state.error}</p>}
      {state.inviteUrl && <div className="setup-callout"><strong>Link gerado — copie agora</strong><p className="invite-url">{state.inviteUrl}</p><p>O banco guarda somente o hash do token; este link não será exibido novamente.</p></div>}
    </div>
  );
}
