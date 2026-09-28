import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CalendarIcon, TeamIcon } from "@/components/icons";
import { DemoNotice, PageHeading } from "@/components/ui";
import { demoAthletes, demoTeam } from "@/data/fixtures";

export const metadata: Metadata = { title: "Turmas" };

export default function TeamsPage() {
  return (
    <div className="page-stack">
      <PageHeading eyebrow="Visão do treinador" title="Minhas turmas" description="Escolha uma turma para acompanhar atletas e iniciar avaliações." />
      <DemoNotice />
      <section aria-labelledby="teams-title">
        <div className="section-heading"><div><span className="section-kicker">TEMPORADA 2026</span><h2 id="teams-title">Turmas ativas</h2></div><span className="count-pill">1 turma</span></div>
        <div className="team-grid">
          <Link className="team-card" href="/turmas/sub-11">
            <div className="team-card-top">
              <div className="team-symbol"><TeamIcon /></div>
              <span className="status-pill status-active"><span /> Ativa</span>
            </div>
            <div className="team-card-content">
              <span className="card-kicker">{demoTeam.category}</span>
              <h3>{demoTeam.name}</h3>
              <p>{demoTeam.seasonLabel}</p>
            </div>
            <div className="team-card-meta">
              <span><TeamIcon /> {demoAthletes.length} atletas</span>
              <span><CalendarIcon /> {demoTeam.scheduleLabel}</span>
            </div>
            <div className="team-card-link">Abrir turma <ArrowIcon /></div>
          </Link>
          <article className="team-card team-card-empty" aria-label="Estado vazio para nova turma">
            <div className="empty-plus" aria-hidden="true">+</div>
            <h3>Nenhuma outra turma</h3>
            <p>A criação de turmas fará parte da base persistente no M2.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
