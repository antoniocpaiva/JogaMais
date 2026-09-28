import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createEmptyEntries,
  getAnsweredCount,
  hasCompletionErrors,
  validateAssessmentForCompletion,
} from "./assessment.ts";
import type { Criterion } from "./models.ts";

const criterion: Criterion = {
  id: "demo",
  label: "Critério",
  prompt: "Pergunta",
  pillar: "technical",
  descriptors: { 1: "Um", 2: "Dois", 3: "Três", 4: "Quatro", 5: "Cinco" },
};

describe("regras da avaliação demonstrativa", () => {
  it("inicia sem atribuir desempenho", () => {
    const entries = createEmptyEntries([criterion]);
    assert.equal(entries[0].score, null);
    assert.equal(entries[0].notObserved, false);
    assert.equal(getAnsweredCount(entries), 0);
  });

  it("exige resposta em todos os critérios e comentário final", () => {
    const errors = validateAssessmentForCompletion(
      { entries: createEmptyEntries([criterion]), finalComment: "" },
      [criterion],
    );
    assert.ok(errors.entries.demo);
    assert.ok(errors.finalComment);
    assert.equal(hasCompletionErrors(errors), true);
  });

  it("aceita uma nota válida acompanhada de comentário", () => {
    const entries = createEmptyEntries([criterion]);
    entries[0].score = 3;
    const errors = validateAssessmentForCompletion(
      { entries, finalComment: "Observação respeitosa e objetiva." },
      [criterion],
    );
    assert.deepEqual(errors.entries, {});
    assert.equal(errors.finalComment, undefined);
    assert.equal(hasCompletionErrors(errors), false);
  });

  it("exige justificativa quando o critério não foi observado", () => {
    const entries = createEmptyEntries([criterion]);
    entries[0].notObserved = true;
    const errors = validateAssessmentForCompletion(
      { entries, finalComment: "Comentário final." },
      [criterion],
    );
    assert.match(errors.entries.demo, /Explique/);

    entries[0].notObservedReason = "Não houve situação suficiente.";
    const valid = validateAssessmentForCompletion(
      { entries, finalComment: "Comentário final." },
      [criterion],
    );
    assert.equal(hasCompletionErrors(valid), false);
  });
});
