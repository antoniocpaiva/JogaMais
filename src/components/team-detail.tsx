"use client";

import Link from "next/link";
import { ArrowIcon, CalendarIcon, CheckIcon, ClockIcon, EditIcon } from "@/components/icons";
import { Breadcrumbs, DemoNotice, PageHeading } from "@/components/ui";
import { demoAthletes, demoTeam, PRIMARY_DEMO_ATHLETE_ID, PRIMARY_DEMO_ATHLETE_NAME } from "@/data/fixtures";
import { useDemo } from "@/components/demo-provider";

export function TeamDetail() {
  const { assessment } = useDemo();

  return (
    <div className="page-stack">
      <Breadcrumbs items={[{ label: "Turmas", href: "/turmas" }, { label: demoTeam.name }]} />
      <PageHeading eyebrow="Turma de demonstração" title={demoTeam.name} description={`${demoTeam.category} · ${demoTeam.seasonLabel}`} action={<Link className="button button-primary" href="/avaliacao"><EditIcon /> Avaliar atleta demo</Link>} />
      <DemoNotice compact />
      <section className="team-summary" aria-label="Resumo da turma">
        <div><span>Atletas</span><strong>{demoAthletes.length}</strong></div>
        <div><span>Horário</span><strong>{demoTeam.scheduleLabel}</strong></div>
        <div><span>Responsável</span><strong>{demoTeam.coachLabel}</strong></div>
      </section>
      <section>
        <div className="section-heading"><div><span className="section-kicker">LISTA DA TURMA</span><h2>Atletas</h2></div><span className="count-pill">{demoAthletes.length} atletas</span></div>
        <div className="athlete-list">
          {demoAthletes.map((athlete, index) => {
            const isPrimaryDemoAthlete = athlete.id === PRIMARY_DEMO_ATHLETE_ID;
            const status = isPrimaryDemoAthlete ? assessment?.status : null;
            return (
              <article className="athlete-row" key={athlete.id}>
                <div className={`avatar avatar-${(index % 4) + 1}`}>{athlete.initials}</div>
                <div className="athlete-main"><strong>{athlete.name}</strong><span>Fixture inteiramente fictícia</span></div>
                <div className="athlete-status">
                  {status === "completed" ? <span className="status-pill status-complete"><CheckIcon /> Concluída</span> : status === "draft" ? <span className="status-pill status-draft"><ClockIcon /> Rascunho</span> : <span className="status-pill status-pending">Pendente</span>}
                </div>
                {isPrimaryDemoAthlete ? <Link className="row-link" href="/perfil" aria-label={`Abrir perfil de ${athlete.name}`}><ArrowIcon /></Link> : <button className="row-link row-link-disabled" disabled aria-label={`Perfil de ${athlete.name} indisponível nesta demonstração`}><ArrowIcon /></button>}
              </article>
            );
          })}
        </div>
      </section>
      <div className="info-strip"><CalendarIcon /><p><strong>Ciclo demonstrativo</strong><span>Apenas {PRIMARY_DEMO_ATHLETE_NAME} possui o fluxo interativo nesta entrega.</span></p><Link href="/avaliacao">Iniciar avaliação <ArrowIcon /></Link></div>
    </div>
  );
}
