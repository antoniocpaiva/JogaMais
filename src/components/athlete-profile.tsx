"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { ArrowIcon, AthleteIcon, CheckIcon, ClockIcon, EditIcon } from "@/components/icons";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { demoCriteria, demoTeam, PILLAR_META, PRIMARY_DEMO_ATHLETE_NAME, SCORE_LABELS } from "@/data/fixtures";

export function AthleteProfile() {
  const { assessment, clearAssessment } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="page-stack profile-page">
      <Breadcrumbs items={[{ label: "Atletas", href: "/atletas" }, { label: PRIMARY_DEMO_ATHLETE_NAME }]} />
      <section className="profile-hero">
        <div className="profile-avatar" aria-label="Avatar neutro da fixture 01"><span>01</span></div>
        <div className="profile-identity"><span className="eyebrow">Perfil de demonstração</span><h1>{PRIMARY_DEMO_ATHLETE_NAME}</h1><p>{demoTeam.name} · Dados esportivos não informados</p><div className="profile-tags"><span>Avatar neutro</span><span>Fixture fictícia</span></div></div>
        <Link className="button button-primary" href="/avaliacao"><EditIcon /> {assessment ? "Abrir avaliação" : "Iniciar avaliação"}</Link>
      </section>

      <div className="privacy-note"><span aria-hidden="true">i</span><p><strong>Demonstração pública segura</strong> Este perfil é inteiramente fictício; não há foto, nascimento, posição ou desempenho predefinido.</p></div>

      <section>
        <div className="section-heading"><div><span className="section-kicker">CICLO DEMONSTRATIVO</span><h2>Avaliação</h2></div>{assessment && <span className={assessment.status === "completed" ? "status-pill status-complete" : "status-pill status-draft"}>{assessment.status === "completed" ? <CheckIcon /> : <ClockIcon />}{assessment.status === "completed" ? "Concluída na demo" : "Rascunho local"}</span>}</div>

        {!assessment ? (
          <EmptyState icon={<AthleteIcon />} title="Nenhuma avaliação criada" description="Comece uma avaliação de demonstração. Os campos chegam vazios para que nenhum desempenho seja atribuído ao atleta." href="/avaliacao" actionLabel="Criar avaliação demo" />
        ) : assessment.status === "draft" ? (
          <section className="draft-card"><div className="draft-icon"><ClockIcon /></div><div><span className="section-kicker">RASCUNHO NESTE NAVEGADOR</span><h3>Avaliação em andamento</h3><p>Continue de onde parou. Este rascunho não foi enviado ou publicado.</p></div><Link className="button button-secondary" href="/avaliacao">Continuar <ArrowIcon /></Link></section>
        ) : (
          <div className="assessment-result">
            <div className="result-grid">
              {assessment.entries.map((entry) => {
                const criterion = demoCriteria.find((item) => item.id === entry.criterionId);
                if (!criterion) return null;
                const pillar = PILLAR_META[criterion.pillar];
                return (
                  <article className="result-card" key={entry.criterionId} style={{ "--pillar-tone": pillar.tone } as React.CSSProperties}>
                    <div className="result-card-head"><span className="pillar-code">{pillar.shortLabel}</span><span>{pillar.label}</span></div>
                    <h3>{criterion.label}</h3>
                    {entry.notObserved ? <p className="not-observed-result">Não observado</p> : <><strong className="score-result">{entry.score}</strong><p>{entry.score ? SCORE_LABELS[entry.score] : "—"}</p></>}
                  </article>
                );
              })}
            </div>
            <article className="comment-card"><span className="section-kicker">COMENTÁRIO FINAL DA DEMO</span><p>{assessment.finalComment}</p></article>
            <div className="history-empty"><div><strong>Histórico comparável ainda indisponível</strong><span>É necessário outro ciclo com a mesma versão de critérios. Nenhum percentual ou ranking é calculado.</span></div></div>
          </div>
        )}
      </section>

      {assessment && (
        <section className="reset-panel">
          {!confirmReset ? <><div><strong>Recomeçar a demonstração</strong><span>Remove somente os dados locais criados neste navegador.</span></div><button className="text-button" onClick={() => setConfirmReset(true)}>Limpar dados da demo</button></> : <><div><strong>Remover a avaliação local?</strong><span>Esta ação não afeta nenhum servidor e não pode ser desfeita.</span></div><div className="confirm-actions"><button className="text-button" onClick={() => setConfirmReset(false)}>Cancelar</button><button className="button button-danger" onClick={() => { clearAssessment(); setConfirmReset(false); }}>Remover</button></div></>}
        </section>
      )}
    </div>
  );
}
