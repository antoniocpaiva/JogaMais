"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AthleteIcon, ProfileIcon, TeamIcon } from "@/components/icons";

const navigation = [
  { href: "/turmas", label: "Turmas", icon: TeamIcon },
  { href: "/atletas", label: "Atletas", icon: AthleteIcon },
  { href: "/perfil", label: "Perfil", icon: ProfileIcon },
];

function Brand() {
  return (
    <Link className="brand" href="/turmas" aria-label="JogaMais — ir para Turmas">
      <span className="brand-mark" aria-hidden="true"><span /><span /></span>
      <span>Joga<span>Mais</span></span>
    </Link>
  );
}

function NavItems() {
  const pathname = usePathname();

  return navigation.map(({ href, label, icon: Icon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link aria-current={active ? "page" : undefined} className={active ? "nav-link nav-link-active" : "nav-link"} href={href} key={href}>
        <Icon /><span>{label}</span>
      </Link>
    );
  });
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <div className="topbar-actions">
            <span className="demo-chip"><span aria-hidden="true" /> Demo local</span>
            <div className="mini-avatar" aria-label="Perfil de demonstração">DM</div>
          </div>
        </div>
      </header>
      <div className="shell-body">
        <aside className="sidebar" aria-label="Navegação principal">
          <nav><NavItems /></nav>
          <div className="sidebar-note"><strong>Protótipo M1</strong><span>Dados apenas neste navegador</span></div>
        </aside>
        <main className="content">{children}</main>
      </div>
      <nav className="mobile-nav" aria-label="Navegação principal"><NavItems /></nav>
    </div>
  );
}
