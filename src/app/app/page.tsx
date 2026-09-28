import Link from "next/link";
import { getMemberships, organizationName } from "@/server/auth";
import { signOut } from "@/app/entrar/actions";

const roleLabels = { coordinator: "Coordenação", coach: "Técnico", guardian: "Responsável" };

export const dynamic = "force-dynamic";

export default async function SecureHomePage() {
  const memberships = await getMemberships();
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><span className="eyebrow">Área segura · M2</span><h1>Organizações</h1><p>Escolha o contexto de trabalho. O papel e os dados disponíveis mudam por organização.</p></div>
        <form action={signOut}><button className="button button-secondary" type="submit">Sair</button></form>
      </div>
      {memberships.length === 0 ? (
        <section className="m2-card"><h2>Primeira configuração</h2><p>Você ainda não possui vínculo ativo. Crie a primeira organização para se tornar coordenador.</p><Link className="button button-primary" href="/app/configuracoes">Configurar organização</Link></section>
      ) : (
        <div className="m2-grid">
          {memberships.map((membership) => (
            <article className="m2-card" key={membership.id}>
              <span className="status-pill status-active">{roleLabels[membership.role]}</span>
              <h2>{organizationName(membership)}</h2>
              <p>Contexto isolado por organização com autorização aplicada no PostgreSQL.</p>
              {membership.role === "coordinator" && <Link className="button button-primary" href={`/app/configuracoes?organizacao=${membership.organization_id}`}>Abrir configurações</Link>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
