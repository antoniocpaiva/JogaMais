import type { AssessmentEntry, Criterion, DemoAssessment } from "@/domain/models";

export type CompletionErrors = {
  entries: Record<string, string>;
  finalComment?: string;
};

export function createEmptyEntries(criteria: Criterion[]): AssessmentEntry[] {
  return criteria.map((criterion) => ({
    criterionId: criterion.id,
    score: null,
    notObserved: false,
    notObservedReason: "",
  }));
}

export function validateAssessmentForCompletion(
  assessment: Pick<DemoAssessment, "entries" | "finalComment">,
  criteria: Criterion[],
): CompletionErrors {
  const entries: Record<string, string> = {};

  for (const criterion of criteria) {
    const entry = assessment.entries.find(
      (candidate) => candidate.criterionId === criterion.id,
    );

    if (!entry || (!entry.notObserved && entry.score === null)) {
      entries[criterion.id] = "Selecione um nível ou marque como não observado.";
      continue;
    }

    if (entry.notObserved && !entry.notObservedReason.trim()) {
      entries[criterion.id] = "Explique por que este critério não foi observado.";
    }
  }

  return {
    entries,
    finalComment: assessment.finalComment.trim()
      ? undefined
      : "Inclua um comentário final para concluir a demonstração.",
  };
}

export function hasCompletionErrors(errors: CompletionErrors) {
  return Boolean(errors.finalComment || Object.keys(errors.entries).length);
}

export function getAnsweredCount(entries: AssessmentEntry[]) {
  return entries.filter((entry) => entry.notObserved || entry.score !== null).length;
}
