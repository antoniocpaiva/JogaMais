import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, AthleteIcon } from "@/components/icons";
import { DemoNotice, PageHeading } from "@/components/ui";
import { demoAthletes, demoTeam, PRIMARY_DEMO_ATHLETE_ID } from "@/data/fixtures";

export const metadata: Metadata = { title: "Atletas" };

export default function AthletesPage() {
  return (
    <div className="page-stack">
      <PageHeading eyebrow="Diretório da demonstração" title="Atletas" description="Consulte os perfis disponíveis na turma de demonstração." />
      <DemoNotice compact />
      <section>
        <div className="section-heading"><div><span className="section-kicker">{demoTeam.name.toUpperCase()}</span><h2>Lista de atletas</h2></div><span className="count-pill">{demoAthletes.length} atletas</span></div>
        <div className="profile-grid">
          {demoAthletes.map((athlete, index) => {
            const isPrimaryDemoAthlete = athlete.id === PRIMARY_DEMO_ATHLETE_ID;
            const content = <><div className={`avatar avatar-large avatar-${(index % 4) + 1}`}>{athlete.initials}</div><div><h3>{athlete.name}</h3><p>{isPrimaryDemoAthlete ? "Perfil disponível" : "Perfil ilustrativo indisponível"}</p></div>{isPrimaryDemoAthlete && <ArrowIcon />}</>;
            return isPrimaryDemoAthlete ? <Link className="profile-card" href="/perfil" key={athlete.id}>{content}</Link> : <article className="profile-card profile-card-muted" key={athlete.id}>{content}</article>;
          })}
        </div>
      </section>
      <section className="empty-inline"><AthleteIcon /><div><strong>Busca e filtros ainda não conectados</strong><span>Serão habilitados junto aos cadastros persistentes no M2.</span></div></section>
    </div>
  );
}
