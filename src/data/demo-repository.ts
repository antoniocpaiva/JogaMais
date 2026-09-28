import { demoAthletes, demoCriteria, demoTeam } from "@/data/fixtures";
import type { DemoAssessment, DemoRepository } from "@/domain/models";

const STORAGE_KEY = "jogamais:m1:assessments";
const CHANGE_EVENT = "jogamais:demo-data-change";
const EMPTY_SNAPSHOT = "{}";

function readStore(): Record<string, DemoAssessment> {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT);
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, DemoAssessment>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const demoRepository: DemoRepository = {
  getAthletes: () => demoAthletes,
  getTeam: () => demoTeam,
  getCriteria: () => demoCriteria,
  getAssessment(athleteId) {
    return readStore()[athleteId] ?? null;
  },
  saveAssessment(assessment) {
    writeStore({ ...readStore(), [assessment.athleteId]: assessment });
  },
  clearAssessment(athleteId) {
    const store = readStore();
    delete store[athleteId];
    writeStore(store);
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;

    const handleStorage = () => listener();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CHANGE_EVENT, handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CHANGE_EVENT, handleStorage);
    };
  },
  getSnapshot() {
    if (typeof window === "undefined") return EMPTY_SNAPSHOT;
    return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  },
  getServerSnapshot: () => EMPTY_SNAPSHOT,
};
