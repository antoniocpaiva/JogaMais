import type { Athlete, Criterion, Pillar, Team } from "@/domain/models";

export const DEMO_CYCLE_LABEL = "Ciclo demonstrativo · 2026";
export const PRIMARY_DEMO_ATHLETE_ID = "atleta-demo-01";
export const PRIMARY_DEMO_ATHLETE_NAME = "Atleta Demo 01";

export const PILLAR_META: Record<
  Pillar,
  { label: string; shortLabel: string; tone: string }
> = {
  technical: {
    label: "Técnico",
    shortLabel: "TEC",
    tone: "var(--color-blue)",
  },
  tactical: {
    label: "Tático",
    shortLabel: "TAT",
    tone: "var(--color-orange)",
  },
  physical: {
    label: "Físico",
    shortLabel: "FÍS",
    tone: "var(--color-lime-dark)",
  },
  behavioral: {
    label: "Comportamental",
    shortLabel: "COM",
    tone: "var(--color-purple)",
  },
};

export const SCORE_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Inicial",
  2: "Em desenvolvimento",
  3: "Adequado à etapa",
  4: "Avançado",
  5: "Destaque",
};

export const demoAthletes: Athlete[] = [
  {
    id: PRIMARY_DEMO_ATHLETE_ID,
    name: PRIMARY_DEMO_ATHLETE_NAME,
    initials: "01",
  },
  { id: "atleta-demo-02", name: "Atleta Demo 02", initials: "02" },
  { id: "atleta-demo-03", name: "Atleta Demo 03", initials: "03" },
  { id: "atleta-demo-04", name: "Atleta Demo 04", initials: "04" },
];

export const demoTeam: Team = {
  id: "sub-11-demo",
  name: "Sub-11",
  category: "Futebol de formação",
  seasonLabel: "Temporada demonstrativa 2026",
  scheduleLabel: "Terças e quintas · 17h30",
  coachLabel: "Treinador de demonstração",
  athleteIds: demoAthletes.map((athlete) => athlete.id),
};

export const demoCriteria: Criterion[] = [
  {
    id: "technical-pass",
    pillar: "technical",
    label: "Passe",
    prompt: "Como o atleta executa e direciona passes nas situações observadas?",
    descriptors: {
      1: "Precisa de orientação frequente para a execução básica.",
      2: "Executa passes simples com consistência ainda limitada.",
      3: "Executa passes adequadamente nas situações usuais da etapa.",
      4: "Mantém boa precisão e escolhe soluções em situações mais difíceis.",
      5: "Demonstra execução consistente e repertório destacado para a etapa.",
    },
  },
  {
    id: "tactical-positioning",
    pillar: "tactical",
    label: "Posicionamento",
    prompt: "Como o atleta ocupa os espaços durante as situações observadas?",
    descriptors: {
      1: "Precisa de orientação constante para reconhecer seu espaço.",
      2: "Reconhece algumas referências, mas ainda perde o posicionamento.",
      3: "Ocupa espaços adequados nas situações usuais da etapa.",
      4: "Ajusta o posicionamento com autonomia em situações variadas.",
      5: "Antecipa espaços e oferece soluções consistentes para a etapa.",
    },
  },
  {
    id: "physical-coordination",
    pillar: "physical",
    label: "Coordenação",
    prompt: "Como o atleta combina movimentos nas atividades observadas?",
    descriptors: {
      1: "Precisa de apoio frequente para organizar movimentos básicos.",
      2: "Combina movimentos simples com alguma irregularidade.",
      3: "Coordena movimentos adequadamente nas tarefas usuais da etapa.",
      4: "Mantém controle em sequências e mudanças mais exigentes.",
      5: "Demonstra controle corporal consistente e destacado para a etapa.",
    },
  },
  {
    id: "behavioral-teamwork",
    pillar: "behavioral",
    label: "Trabalho em equipe",
    prompt: "Como o atleta coopera com o grupo nas situações observadas?",
    descriptors: {
      1: "Precisa de mediação frequente para participar com o grupo.",
      2: "Coopera em alguns momentos, ainda com pouca constância.",
      3: "Coopera adequadamente nas situações usuais da etapa.",
      4: "Apoia colegas e contribui ativamente em situações variadas.",
      5: "Fortalece o coletivo de forma consistente e destacada para a etapa.",
    },
  },
];
