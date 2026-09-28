"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-stack">
      <section className="empty-state">
        <div className="empty-plus" aria-hidden="true">!</div>
        <h1>Algo não saiu como esperado</h1>
        <p>Os dados da demonstração continuam neste navegador. Tente carregar esta etapa novamente.</p>
        <button className="button button-primary" onClick={reset}>Tentar novamente</button>
      </section>
    </div>
  );
}
