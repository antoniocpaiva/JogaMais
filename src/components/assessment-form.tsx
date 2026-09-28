"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { ArrowIcon, CheckIcon, ClockIcon, EditIcon } from "@/components/icons";
import { Breadcrumbs, DemoNotice } from "@/components/ui";
import { DEMO_CYCLE_LABEL, demoCriteria, demoTeam, PILLAR_META, PRIMARY_DEMO_ATHLETE_ID, PRIMARY_DEMO_ATHLETE_NAME, SCORE_LABELS } from "@/data/fixtures";
import { createEmptyEntries, getAnsweredCount, hasCompletionErrors, validateAssessmentForCompletion, type CompletionErrors } from "@/domain/assessment";
import type { AssessmentEntry, DemoAssessment } from "@/domain/models";

function formatSavedTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function AssessmentForm() {
  const { assessment, saveAssessment } = useDemo();
  const [editingCompleted, setEditingCompleted] = useState(false);

  if (assessment?.status === "completed" && !editingCompleted) {
    return (
      <div className="page-stack assessment-page">
        <Breadcrumbs items={[{ label: demoTeam.name, href: "/turmas/sub-11" }, { label: PRIMARY_DEMO_ATHLETE_NAME, href: "/perfil" }, { label: "Avaliação" }]} />
        <section className="success-card">
          <div className="success-mark"><CheckIcon /></div>
          <span className="eyebrow">Demonstração concluída</span>
          <h1>Avaliação salva neste navegador</h1>
          <p>O perfil de {PRIMARY_DEMO_ATHLETE_NAME} foi atualizado para esta demonstração. Nenhum dado foi publicado ou enviado a um servidor.</p>
          <div className="success-actions"><Link className="button button-primary" href="/perfil">Ver perfil atualizado <ArrowIcon /></Link><button className="button button-secondary" onClick={() => setEditingCompleted(true)}><EditIcon /> Revisar respostas</button></div>
        </section>
      </div>
    );
  }

  return (
    <AssessmentEditor
      initialAssessment={assessment}
      key={assessment?.updatedAt ?? "new-assessment"}
      onComplete={() => setEditingCompleted(false)}
      saveAssessment={saveAssessment}
    />
  );
}

function AssessmentEditor({ initialAssessment, saveAssessment, onComplete }: { initialAssessment: DemoAssessment | null; saveAssessment: (assessment: DemoAssessment) => void; onComplete: () => void }) {
  const [entries, setEntries] = useState<AssessmentEntry[]>(initialAssessment?.entries ?? createEmptyEntries(demoCriteria));
  const [finalComment, setFinalComment] = useState(initialAssessment?.finalComment ?? "");
  const [errors, setErrors] = useState<CompletionErrors>({ entries: {} });
  const [saveMessage, setSaveMessage] = useState(initialAssessment ? `Rascunho recuperado · ${formatSavedTime(initialAssessment.updatedAt)}` : "Ainda não salvo");

  const answeredCount = getAnsweredCount(entries);
  const progress = Math.round((answeredCount / demoCriteria.length) * 100);

  const candidate = useMemo(() => ({ entries, finalComment }), [entries, finalComment]);

  useEffect(() => {
    if (!hasCompletionErrors(errors)) return;
    document.querySelector<HTMLElement>("[data-field-error='true']")?.focus();
  }, [errors]);

  function updateEntry(criterionId: string, update: Partial<AssessmentEntry>) {
    setEntries((current) => current.map((entry) => entry.criterionId === criterionId ? { ...entry, ...update } : entry));
    setErrors((current) => ({ ...current, entries: { ...current.entries, [criterionId]: "" } }));
    setSaveMessage("Alterações não salvas");
  }

  function buildAssessment(status: "draft" | "completed"): DemoAssessment {
    const now = new Date().toISOString();
    return { athleteId: PRIMARY_DEMO_ATHLETE_ID, teamId: demoTeam.id, cycleLabel: DEMO_CYCLE_LABEL, status, entries, finalComment, updatedAt: now, completedAt: status === "completed" ? now : initialAssessment?.completedAt };
  }

  function handleSaveDraft() {
    const draft = buildAssessment("draft");
    saveAssessment(draft);
    setSaveMessage(`Rascunho salvo localmente · ${formatSavedTime(draft.updatedAt)}`);
  }

  function handleComplete() {
    const validation = validateAssessmentForCompletion(candidate, demoCriteria);
    setErrors(validation);
    if (hasCompletionErrors(validation)) return;
    saveAssessment(buildAssessment("completed"));
    onComplete();
  }

  return (
    <div className="page-stack assessment-page">
      <Breadcrumbs items={[{ label: demoTeam.name, href: "/turmas/sub-11" }, { label: PRIMARY_DEMO_ATHLETE_NAME, href: "/perfil" }, { label: "Avaliação" }]} />
      <header className="assessment-header">
        <div><span className="eyebrow">{DEMO_CYCLE_LABEL}</span><h1>Avaliação do atleta</h1><p>Registre apenas o que foi observado. Os critérios são exemplos provisórios.</p></div>
        <div className="athlete-mini"><div className="avatar avatar-1">01</div><div><strong>{PRIMARY_DEMO_ATHLETE_NAME}</strong><span>{demoTeam.name}</span></div></div>
      </header>
      <DemoNotice compact />
      <section className="progress-card" aria-label={`Progresso: ${answeredCount} de ${demoCriteria.length} critérios respondidos`}>
        <div><strong>Progresso do preenchimento</strong><span>{answeredCount} de {demoCriteria.length} critérios</span></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="criteria-stack">
          {demoCriteria.map((criterion, index) => {
            const entry = entries.find((item) => item.criterionId === criterion.id) ?? createEmptyEntries([criterion])[0];
            const pillar = PILLAR_META[criterion.pillar];
            const error = errors.entries[criterion.id];
            return (
              <fieldset className="criterion-card" data-field-error={error ? "true" : undefined} key={criterion.id} style={{ "--pillar-tone": pillar.tone } as React.CSSProperties} tabIndex={error ? -1 : undefined}>
                <legend className="sr-only">{pillar.label}: {criterion.label}</legend>
                <div className="criterion-heading">
                  <span className="criterion-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><span className="pillar-label"><i /> {pillar.label}</span><h2>{criterion.label}</h2><p>{criterion.prompt}</p></div>
                </div>
                <div className="scale-labels" aria-hidden="true"><span>Inicial</span><span>Destaque</span></div>
                <div className="score-scale">
                  {([1, 2, 3, 4, 5] as const).map((score) => (
                    <label className={entry.score === score && !entry.notObserved ? "score-option score-option-selected" : "score-option"} key={score}>
                      <input checked={entry.score === score && !entry.notObserved} name={criterion.id} onChange={() => updateEntry(criterion.id, { score, notObserved: false, notObservedReason: "" })} type="radio" value={score} />
                      <strong>{score}</strong><span>{SCORE_LABELS[score]}</span>
                    </label>
                  ))}
                </div>
                {entry.score && !entry.notObserved && <p className="selected-descriptor"><strong>Nível {entry.score}</strong>{criterion.descriptors[entry.score]}</p>}
                <details className="anchors"><summary>Ver descritores de todos os níveis</summary><ol>{([1, 2, 3, 4, 5] as const).map((score) => <li key={score}><strong>{score} · {SCORE_LABELS[score]}</strong><span>{criterion.descriptors[score]}</span></li>)}</ol></details>
                <label className="not-observed-toggle"><input checked={entry.notObserved} onChange={(event) => updateEntry(criterion.id, { notObserved: event.target.checked, score: event.target.checked ? null : entry.score })} type="checkbox" /><span aria-hidden="true" /><strong>Não observado</strong><small>Não atribuir nível</small></label>
                {entry.notObserved && <label className="field"><span>Justificativa <em>obrigatória</em></span><textarea aria-describedby={`${criterion.id}-reason-help`} data-field-error={error ? "true" : undefined} onChange={(event) => updateEntry(criterion.id, { notObservedReason: event.target.value })} placeholder="Ex.: não houve situação suficiente para observar este critério." rows={3} value={entry.notObservedReason} /><small id={`${criterion.id}-reason-help`}>Explique de forma objetiva, sem atribuir nota.</small></label>}
                {error && <p className="field-error" role="alert">{error}</p>}
              </fieldset>
            );
          })}
        </div>

        <section className="comment-section">
          <div><span className="section-kicker">SÍNTESE</span><h2>Comentário final</h2><p>Registre uma observação clara e respeitosa sobre este ciclo demonstrativo.</p></div>
          <label className="field"><span>Comentário <em>obrigatório para concluir</em></span><textarea data-field-error={errors.finalComment ? "true" : undefined} onChange={(event) => { setFinalComment(event.target.value); setErrors((current) => ({ ...current, finalComment: undefined })); setSaveMessage("Alterações não salvas"); }} placeholder="Descreva o que foi observado e um próximo foco de desenvolvimento." rows={5} value={finalComment} /><small>Evite comparações com outros atletas.</small></label>
          {errors.finalComment && <p className="field-error" role="alert">{errors.finalComment}</p>}
        </section>

        <div className="form-actions">
          <div className="save-state" aria-live="polite"><ClockIcon /><span>{saveMessage}</span></div>
          <div><button className="button button-secondary" onClick={handleSaveDraft} type="button">Salvar rascunho</button><button className="button button-primary" onClick={handleComplete} type="button"><CheckIcon /> Concluir demonstração</button></div>
        </div>
      </form>
    </div>
  );
}
