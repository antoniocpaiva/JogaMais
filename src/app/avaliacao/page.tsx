import type { Metadata } from "next";
import { AssessmentForm } from "@/components/assessment-form";

export const metadata: Metadata = { title: "Avaliação demonstrativa" };

export default function AssessmentPage() {
  return <AssessmentForm />;
}
