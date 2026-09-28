import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMemberships, organizationName } from "@/server/auth";
import { assignCoach, bootstrapOrganization, createAthlete, createSeason, createTeam, linkGuardian, revokeAccess } from "@/app/app/actions";
import { InvitationForm } from "@/app/app/invitation-form";

type Search = Promise<{ organizacao?: string }>;
type Row = Record<string, string | null>;

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Search }) {
  const memberships = await getMemberships();
  const coordinatorMemberships = memberships.filter((item) => item.role === "coordinator");
  if (coordinatorMemberships.length === 0) {
    if (memberships.length > 0) redirect("/app");
    return (
      <div className="page-stack"><Link className="breadcrumbs" href="/app">← Área segura</Link><section className="m2-card m2-narrow"><span className="eyebrow">Primeiro acesso</span><h1>Crie sua organização</h1><p>O usuário atual receberá o papel de coordenador. Nenhum outro acesso é concedido automaticamente.</p><form action={bootstrapOrganization} className="m2-form"><label>Nome da organização<input maxLength={120} minLength={2} name="name" required /></label><button className="button button-primary" type="submit">Criar organização</button></form></section></div>
    );
  }

  const requested = (await searchParams).organizacao;
  const current = coordinatorMemberships.find((item) => item.organization_id === requested) ?? coordinatorMemberships[0];
  const organizationId = current.organization_id;
  const supabase = await createClient();
  const [seasonsResult, teamsResult, athletesResult, peopleResult, coachLinksResult, guardianLinksResult] = await Promise.all([
    supabase.from("seasons").select("id,name,starts_on,ends_on,status").eq("organization_id", organizationId).order("starts_on", { ascending: false }),
    supabase.from("teams").select("id,name,age_category,season_id,status").eq("organization_id", organizationId).order("name"),
    supabase.from("athletes").select("id,display_name,status").eq("organization_id", organizationId).order("display_name"),
    supabase.from("memberships").select("id,role,user_id,status").eq("organization_id", organizationId).eq("status", "active"),
    supabase.from("team_coaches").select("id,team_id,membership_id,status").eq("organization_id", organizationId).eq("status", "active"),
    supabase.from("guardian_athletes").select("id,athlete_id,guardian_membership_id,relationship,status").eq("organization_id", organizationId).eq("status", "active"),
  ]);
  const firstError = [seasonsResult, teamsResult, athletesResult, peopleResult, coachLinksResult, guardianLinksResult].find((result) => result.error)?.error;
  if (firstError) throw new Error("Não foi possível carregar a configuração da organização.");
  const seasons = (seasonsResult.data ?? []) as Row[];
  const teams = (teamsResult.data ?? []) as Row[];
  const athletes = (athletesResult.data ?? []) as Row[];
  const people = (peopleResult.data ?? []) as Row[];
  const coaches = people.filter((item) => item.role === "coach");
  const guardians = people.filter((item) => item.role === "guardian");
  const coachLinks = (coachLinksResult.data ?? []) as Row[];
  const guardianLinks = (guardianLinksResult.data ?? []) as Row[];

  return (
    <div className="page-stack">
      <Link className="breadcrumbs" href="/app">← Organizações</Link>
      <div className="page-heading"><div><span className="eyebrow">Coordenação · M2</span><h1>{organizationName(current)}</h1><p>Cadastros essenciais com validação no servidor e isolamento no banco.</p></div></div>
      <section className="m2-section"><div><h2>Convites de acesso</h2><p>O link expira em sete dias e só funciona para o e-mail convidado.</p></div><InvitationForm organizationId={organizationId} /></section>
      <section className="m2-section"><div><h2>1. Temporadas</h2><p>{seasons.length} cadastrada(s)</p></div><form action={createSeason} className="m2-inline-form"><input name="organizationId" type="hidden" value={organizationId} /><label>Nome<input name="name" placeholder="2027" required /></label><label>Início<input name="startsOn" required type="date" /></label><label>Fim<input name="endsOn" required type="date" /></label><button className="button button-primary" type="submit">Adicionar</button></form></section>
      <section className="m2-section"><div><h2>2. Turmas</h2><p>{teams.length} cadastrada(s)</p></div>{seasons.length ? <form action={createTeam} className="m2-inline-form"><input name="organizationId" type="hidden" value={organizationId} /><label>Temporada<select name="seasonId" required>{seasons.map((row) => <option key={row.id} value={row.id ?? ""}>{row.name}</option>)}</select></label><label>Nome<input name="name" placeholder="Sub-11" required /></label><label>Categoria<input name="ageCategory" placeholder="Sub-11" required /></label><button className="button button-primary" type="submit">Adicionar</button></form> : <p className="m2-hint">Cadastre uma temporada primeiro.</p>}</section>
      <section className="m2-section"><div><h2>3. Atletas</h2><p>{athletes.length} cadastrado(s)</p></div>{teams.length ? <form action={createAthlete} className="m2-inline-form"><input name="organizationId" type="hidden" value={organizationId} /><label>Turma<select name="teamId" required>{teams.map((row) => <option key={row.id} value={row.id ?? ""}>{row.name}</option>)}</select></label><label>Nome de exibição<input name="displayName" required /></label><label>Nascimento (opcional)<input name="birthDate" type="date" /></label><label>Posição (opcional)<input name="preferredPosition" /></label><button className="button button-primary" type="submit">Adicionar</button></form> : <p className="m2-hint">Cadastre uma turma primeiro.</p>}</section>
      <section className="m2-section"><div><h2>4. Técnicos</h2><p>Atribuição por turma; a revogação é imediata.</p></div>{teams.length && coaches.length ? <form action={assignCoach} className="m2-inline-form"><input name="organizationId" type="hidden" value={organizationId} /><label>Turma<select name="teamId" required>{teams.map((row) => <option key={row.id} value={row.id ?? ""}>{row.name}</option>)}</select></label><label>Vínculo do técnico<select name="membershipId" required>{coaches.map((row) => <option key={row.id} value={row.id ?? ""}>{row.user_id}</option>)}</select></label><button className="button button-primary" type="submit">Atribuir</button></form> : <p className="m2-hint">É necessário um técnico com convite aceito e uma turma ativa.</p>}{coachLinks.map((row) => <form action={revokeAccess} className="m2-revoke" key={row.id}><input name="organizationId" type="hidden" value={organizationId} /><input name="recordId" type="hidden" value={row.id ?? ""} /><input name="kind" type="hidden" value="coach" /><span>Técnico {row.membership_id} · turma {row.team_id}</span><button className="button button-secondary" type="submit">Revogar</button></form>)}</section>
      <section className="m2-section"><div><h2>5. Responsáveis</h2><p>O portal familiar exige membership ativo e vínculo explícito com o atleta.</p></div>{athletes.length && guardians.length ? <form action={linkGuardian} className="m2-inline-form"><input name="organizationId" type="hidden" value={organizationId} /><label>Atleta<select name="athleteId" required>{athletes.map((row) => <option key={row.id} value={row.id ?? ""}>{row.display_name}</option>)}</select></label><label>Vínculo do responsável<select name="membershipId" required>{guardians.map((row) => <option key={row.id} value={row.id ?? ""}>{row.user_id}</option>)}</select></label><label>Parentesco<input name="relationship" placeholder="Responsável" required /></label><button className="button button-primary" type="submit">Vincular</button></form> : <p className="m2-hint">É necessário um responsável com convite aceito e um atleta ativo.</p>}{guardianLinks.map((row) => <form action={revokeAccess} className="m2-revoke" key={row.id}><input name="organizationId" type="hidden" value={organizationId} /><input name="recordId" type="hidden" value={row.id ?? ""} /><input name="kind" type="hidden" value="guardian" /><span>{row.relationship} · atleta {row.athlete_id}</span><button className="button button-secondary" type="submit">Revogar</button></form>)}</section>
    </div>
  );
}
