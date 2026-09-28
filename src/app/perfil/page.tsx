import type { Metadata } from "next";
import { AthleteProfile } from "@/components/athlete-profile";

export const metadata: Metadata = { title: "Perfil do atleta de demonstração" };

export default function ProfilePage() {
  return <AthleteProfile />;
}
