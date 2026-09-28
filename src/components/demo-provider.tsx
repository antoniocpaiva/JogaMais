"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { demoRepository } from "@/data/demo-repository";
import { PRIMARY_DEMO_ATHLETE_ID } from "@/data/fixtures";
import type { DemoAssessment } from "@/domain/models";

type DemoContextValue = {
  assessment: DemoAssessment | null;
  saveAssessment: (assessment: DemoAssessment) => void;
  clearAssessment: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    demoRepository.subscribe,
    demoRepository.getSnapshot,
    demoRepository.getServerSnapshot,
  );

  const assessment = useMemo(() => {
    try {
      const store = JSON.parse(snapshot) as Record<string, DemoAssessment>;
      return store[PRIMARY_DEMO_ATHLETE_ID] ?? null;
    } catch {
      return null;
    }
  }, [snapshot]);

  const saveAssessment = useCallback((nextAssessment: DemoAssessment) => {
    demoRepository.saveAssessment(nextAssessment);
  }, []);

  const clearAssessment = useCallback(() => {
    demoRepository.clearAssessment(PRIMARY_DEMO_ATHLETE_ID);
  }, []);

  const value = useMemo(
    () => ({ assessment, saveAssessment, clearAssessment }),
    [assessment, saveAssessment, clearAssessment],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo precisa estar dentro de DemoProvider.");
  return context;
}
