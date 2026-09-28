"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AthleteIcon, ProfileIcon, TeamIcon } from "@/components/icons";

const demoNavigation = [
  { href: "/turmas", label: "Turmas", icon: TeamIcon },
  { href: "/atletas", label: "Atletas", icon: AthleteIcon },
  { href: "/perfil", label: "Perfil", icon: ProfileIcon },
];

const secureNavigation = [
  { href: "/app", label: "Organizações", icon: TeamIcon },
  { href: "/app/configuracoes", label: "Configurações", icon: ProfileIcon },
];

function Brand() {
  return (
    <Link className="brand" href="/turmas" aria-label="JogaMais — ir para Turmas">
      <span className="brand-mark" aria-hidden="true"><span /><span /></span>
      <span>Joga<span>Mais</span></span>
    </Link>
  );
}

function NavItems({ secure }: { secure: boolean }) {
  const pathname = usePathname();

  const navigation = secure ? secureNavigation : demoNavigation;

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
  const pathname = usePathname();
  const isLogin = pathname === "/entrar" || pathname.startsWith("/convite/");
  const isSecure = pathname.startsWith("/app");

  if (isLogin) {
    return <main className="auth-content">{children}</main>;
  }

  return (
    <div className="app-frame">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <div className="topbar-actions">
            <span className="demo-chip"><span aria-hidden="true" /> {isSecure ? "M2 seguro" : "Demo local"}</span>
            <div className="mini-avatar" aria-label={isSecure ? "Sessão autenticada" : "Perfil de demonstração"}>{isSecure ? "M2" : "DM"}</div>
          </div>
        </div>
      </header>
      <div className="shell-body">
        <aside className="sidebar" aria-label="Navegação principal">
          <nav><NavItems secure={isSecure} /></nav>
          <div className="sidebar-note"><strong>{isSecure ? "Fundação M2" : "Protótipo M1"}</strong><span>{isSecure ? "Auth e RLS multi-tenant" : "Dados apenas neste navegador"}</span></div>
        </aside>
        <main className="content">{children}</main>
      </div>
      <nav className="mobile-nav" aria-label="Navegação principal"><NavItems secure={isSecure} /></nav>
    </div>
  );
}
