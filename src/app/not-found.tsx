import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-stack">
      <section className="empty-state">
        <div className="empty-plus" aria-hidden="true">?</div>
        <h1>Página não encontrada</h1>
        <p>Este caminho não faz parte da demonstração local do JogaMais.</p>
        <Link className="button button-primary" href="/turmas">Voltar para Turmas</Link>
      </section>
    </div>
  );
}
