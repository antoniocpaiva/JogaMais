import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, SparkIcon } from "@/components/icons";

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "demo-notice demo-notice-compact" : "demo-notice"}>
      <SparkIcon />
      <div><strong>Demonstração local</strong><span>Dados fictícios; sem autenticação ou servidor. Alterações ficam somente neste navegador.</span></div>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="breadcrumbs">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>{index > 0 && <span aria-hidden="true">/</span>}{item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}</span>
      ))}
    </nav>
  );
}

export function EmptyState({ icon, title, description, href, actionLabel }: { icon: ReactNode; title: string; description: string; href?: string; actionLabel?: string }) {
  return (
    <section className="empty-state">
      <div className="empty-icon">{icon}</div><h2>{title}</h2><p>{description}</p>
      {href && actionLabel && <Link className="button button-primary" href={href}>{actionLabel}<ArrowIcon /></Link>}
    </section>
  );
}
