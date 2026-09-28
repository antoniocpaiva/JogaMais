import type { Metadata } from "next";
import { TeamDetail } from "@/components/team-detail";

export const metadata: Metadata = { title: "Turma Sub-11" };

export default function TeamDetailPage() {
  return <TeamDetail />;
}
