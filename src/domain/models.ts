export type Pillar = "technical" | "tactical" | "physical" | "behavioral";

export type AssessmentStatus = "draft" | "completed";

export type Athlete = {
  id: string;
  name: string;
  initials: string;
  isNamedPrototype?: boolean;
};

export type Team = {
  id: string;
  name: string;
  category: string;
  seasonLabel: string;
  scheduleLabel: string;
  coachLabel: string;
  athleteIds: string[];
};

export type Criterion = {
  id: string;
  label: string;
  prompt: string;
  pillar: Pillar;
  descriptors: Record<1 | 2 | 3 | 4 | 5, string>;
};

export type AssessmentEntry = {
  criterionId: string;
  score: 1 | 2 | 3 | 4 | 5 | null;
  notObserved: boolean;
  notObservedReason: string;
};

export type DemoAssessment = {
  athleteId: string;
  teamId: string;
  cycleLabel: string;
  status: AssessmentStatus;
  entries: AssessmentEntry[];
  finalComment: string;
  updatedAt: string;
  completedAt?: string;
};

export type DemoRepository = {
  getAthletes(): Athlete[];
  getTeam(): Team;
  getCriteria(): Criterion[];
  getAssessment(athleteId: string): DemoAssessment | null;
  saveAssessment(assessment: DemoAssessment): void;
  clearAssessment(athleteId: string): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): string;
  getServerSnapshot(): string;
};
